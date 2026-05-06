import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import {
  CodeOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  CloseOutlined,
  SettingOutlined,
  PlusOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const JOB_TYPES = [
  { value: 'full-time', label: '💼 Full-time' },
  { value: 'part-time', label: '⏰ Part-time' },
  { value: 'remote', label: '🌍 Remote' },
  { value: 'internship', label: '🎓 Internship' },
];

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium', 'Bulgaria', 'Brazil',
  'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong',
  'Hungary', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kuwait', 'Latvia',
  'Lithuania', 'Luxembourg', 'Malaysia', 'Malta', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam'
].map(c => ({ value: c, label: c }));

export default function PreferencesForm({ onSaved }) {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState(undefined);
  const [loading, setLoading] = useState(false);

  /* sync auth email */
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  /* skills */
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

  const removeSkill = (skill) =>
    setSkills(skills.filter((s) => s !== skill));

  const resetForm = () => {
    setName('');
    setSkills([]);
    setSkillInput('');
    setLocation('');
    setJobType(undefined);
  };

  /* submit */
  const handleSubmit = async () => {
  if (!user) {
    message.error('You must be logged in.');
    return;
  }

  if (!name.trim()) {
    message.warning('Enter your name.');
    return;
  }

  if (!email.trim()) {
    message.warning('Email missing.');
    return;
  }

  if (skills.length === 0) {
    message.warning('Add at least one skill.');
    return;
  }

  if (!location.trim()) {
    message.warning('Enter location.');
    return;
  }

  if (!jobType) {
    message.warning('Select job type.');
    return;
  }

  setLoading(true);

  try {
    /* daily submission check */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: existing, error: checkError } = await supabase
      .from('job_preferences')
      .select('id')
      .eq('email', email)
      .gte('created_at', todayStart.toISOString())
      .lte('created_at', todayEnd.toISOString())
      .limit(1);

    if (checkError) throw checkError;

    // if (existing?.length > 0) {
    //   message.error('You already submitted today.');
    //   setLoading(false);
    //   return;
    // }

    /* insert into supabase */
    const { error: insertError } = await supabase
      .from('job_preferences')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          skills: skills.join(', '),
          location: location.trim(),
          job_type: jobType,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) throw insertError;

    /* 🔥 TRIGGER WEBHOOK */
    try {
      const res = await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/webhook-test/jobpulse-apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          skills,
          location,
          jobType,
        }),
      });

      if (!res.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await res.json();
      console.log('Webhook success:', data);

    } catch (webhookError) {
      // add proper catch for debugging
      
      console.error('Webhook error:', webhookError);
      // 👇 Do NOT block user if webhook fails
    }

    message.success('Preferences saved successfully!');
    resetForm();
    onSaved?.();

  } catch (err) {
    console.error(err);
    message.error(err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-section">
      <div className="form-card">

        <div className="form-header">
          <SettingOutlined />
          <h2>Set Your Job Preferences</h2>
        </div>

        <Form layout="vertical" size="large">

          {/* NAME */}
          <Form.Item label={<span><UserOutlined /> Name</span>}>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item label={<span><MailOutlined /> Email</span>}>
            <Input value={email} disabled />
          </Form.Item>

          {/* SKILLS */}
          <Form.Item label={<span><CodeOutlined /> Skills</span>}>
            <div style={{ marginBottom: 8 }}>
              {skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <CloseOutlined onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>

            <Input
              prefix={<PlusOutlined />}
              placeholder="Add skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onBlur={() => skillInput && addSkill(skillInput)}
            />
          </Form.Item>

          {/* LOCATION */}
          <Form.Item label={<span><EnvironmentOutlined /> Location</span>}>
            <Select
              showSearch
              placeholder="Select your country"
              value={location || undefined}
              onChange={(val) => setLocation(val)}
              options={COUNTRIES}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {/* JOB TYPE */}
          <Form.Item label={<span><LaptopOutlined /> Job Type</span>}>
            <Select
              options={JOB_TYPES}
              value={jobType}
              onChange={setJobType}
              placeholder="Select job type"
            />
          </Form.Item>

          {/* SUBMIT */}
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            block
          >
            Save Preferences
          </Button>

        </Form>
      </div>
    </div>
  );
}