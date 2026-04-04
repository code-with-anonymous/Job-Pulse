import { useState } from 'react';
import { Form, Input, Select, Button, message, Tag } from 'antd';
import {
  CodeOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  CloseOutlined,
  SettingOutlined,
  PlusOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { db, collection, addDoc } from '../config/Firebase';

const JOB_TYPES = [
  { value: 'full-time', label: '💼  Full-time' },
  { value: 'part-time', label: '⏰  Part-time' },
  { value: 'remote', label: '🌍  Remote' },
  { value: 'internship', label: '🎓  Internship' },
];

export default function PreferencesForm({ onSaved }) {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState(undefined);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = (value) => {
    const trimmed = value.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async () => {
    // Validation
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error('Please enter a valid email address.');
      return;
    }
    if (skills.length === 0) {
      message.warning('Please add at least one skill.');
      return;
    }
    if (!location.trim()) {
      message.warning('Please enter a preferred location.');
      return;
    }
    if (!jobType) {
      message.warning('Please select a job type.');
      return;
    }

    const payload = {
      email: email.trim(),
      skills,
      location: location.trim(),
      jobType,
      submittedAt: new Date().toISOString(),
    };

    setLoading(true);
    const webhookUrl = "http://localhost:5678/webhook-test/41a43486-6d54-43e1-a053-abbaca3edb58";

    try {
      console.log("Sending to n8n:", payload);

      // 🔗 Send to n8n webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("n8n response:", result);

      // ✅ (Optional) Keep Firebase save
      const docRef = await addDoc(collection(db, 'jobPreferences'), payload);

      message.success({
        content: "🎉 Preferences saved & sent to automation!",
        duration: 4,
      });

      setSkills([]);
      setSkillInput('');
      setLocation('');
      setJobType(undefined);
      setEmail('');
    }
    catch (error) {
        console.error('Error saving to Firebase:', error);
        // Even if Firebase fails, save locally
        const existing = JSON.parse(localStorage.getItem('jobpulse_prefs') || '[]');
        existing.unshift(payload);
        localStorage.setItem('jobpulse_prefs', JSON.stringify(existing));
        onSaved?.();

        message.success({
          content: '🎉  Preferences saved locally! Firebase will be configured later.',
          duration: 4,
        });

        setSkills([]);
        setSkillInput('');
        setLocation('');
        setJobType(undefined);
        setEmail('');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="form-section">
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">
              <SettingOutlined />
            </div>
            <h2>Set Your Job Preferences</h2>
            <p>Tell us what you're looking for and we'll find the best matches.</p>
          </div>

          <Form layout="vertical" size="large">
            {/* Email */}
            <Form.Item
              label={
                <span>
                  <MailOutlined style={{ marginRight: 6 }} />
                  Email
                </span>
              }
              required
            >
              <Input
                type="email"
                prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            {/* Skills tag input */}
            <Form.Item
              label={
                <span>
                  <CodeOutlined style={{ marginRight: 6 }} />
                  Skills
                </span>
              }
            >
              <div className="skill-tags-container" style={{ marginTop: 0, marginBottom: skills.length ? 8 : 0 }}>
                {skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <CloseOutlined className="close-btn" onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
              <Input
                prefix={<PlusOutlined style={{ color: 'var(--text-muted)' }} />}
                placeholder="Type a skill and press Enter (e.g., React, Python, SQL)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }}
              />
            </Form.Item>

            {/* Location */}
            <Form.Item
              label={
                <span>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  Preferred Location
                </span>
              }
            >
              <Input
                prefix={<EnvironmentOutlined style={{ color: 'var(--text-muted)' }} />}
                placeholder="e.g., Remote, Pakistan, Lahore, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Item>

            {/* Job Type */}
            <Form.Item
              label={
                <span>
                  <LaptopOutlined style={{ marginRight: 6 }} />
                  Job Type
                </span>
              }
            >
              <Select
                placeholder="Select job type"
                options={JOB_TYPES}
                value={jobType}
                onChange={setJobType}
                suffixIcon={<LaptopOutlined style={{ color: 'var(--text-muted)' }} />}
              />
            </Form.Item>

            {/* Submit */}
            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                block
              >
                {loading ? 'Saving Preferences...' : 'Save Preferences'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
