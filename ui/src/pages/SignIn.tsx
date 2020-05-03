import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { Avatar, Button, Form, Input, Tabs } from 'antd';
import { KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import './SignIn.less';
import { signIn } from '../store/auth/actions';

const layout = {
  wrapperCol: { span: 24 },
};

const SignInForm = props => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const dispatch = useDispatch();

  function handleSignIn() {
    if (!email || !password) return;
    dispatch(signIn({ email: email!, password: password! }));
  }

  function handleSetField(e: ChangeEvent<HTMLInputElement>) {
    const event = e.currentTarget;
    switch (event.name) {
      case 'email':
        return setEmail(event.value);
      case 'password':
        return setPassword(event.value);
    }
  }

  return (
    <Form {...layout} name="sign_in" onFinish={handleSignIn}>
      <Form.Item
        rules={[{ required: true, message: 'Please enter your email' }]}
      >
        <Input
          size="large"
          name="email"
          prefix={<MailOutlined />}
          value={email}
          onChange={handleSetField}
        />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password
          size="large"
          name="password"
          prefix={<KeyOutlined />}
          value={password}
          onChange={handleSetField}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

const SignUpForm = props => {
  return <div>Not yet implemented</div>;
};

const SignIn = props => {
  return (
    <div className="sign-in">
      <div className="card">
        <Tabs>
          <Tabs.TabPane tab="Sign in" key="sign_in">
            <SignInForm />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Create account" key="sign_up">
            <SignUpForm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default SignIn;
