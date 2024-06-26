import React, { useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Text } from '@/components/text';

const AuthPage: React.FC = () => {
  const [signUp, setSignUp] = useState<boolean>(true);
  const router = useRouter();

  interface SignUpFormState {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface LoginFormState {
    email: string;
    password: string;
  }

  const initialSignUpState: SignUpFormState = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const initialLoginState: LoginFormState = {
    email: '',
    password: '',
  };

  const [signUpForm, setSignUpForm] = useState<SignUpFormState>(initialSignUpState);
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChangeSignUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpForm({ ...signUpForm, [name]: value });
  };

  const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/signup', signUpForm);
      if (response.status === 201) {
        router.push('/auth');
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message || 'An error occurred while signing up.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', loginForm);
      if (response.status === 200) {
        router.push('/auth');
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message || 'An error occurred while logging in.');
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar>
        <NavbarSection>
          <NavbarItem href='/' current>PoolBnb</NavbarItem>
          <NavbarItem href='/'>Home</NavbarItem>
        </NavbarSection>
      </Navbar>
      <main className='flex-grow flex items-center justify-center'>
        <div className='container mx-auto p-4 shadow-lg rounded-md'>
          <div className='flex justify-center mb-4'>
            <Button className={`mx-2 px-4 py-2 ${signUp ? 'font-bold' : ''}`} onClick={() => setSignUp(true)}>
              Sign Up
            </Button>
            <Button className={`mx-2 px-4 py-2 ${!signUp ? 'font-bold' : ''}`} onClick={() => setSignUp(false)}>
              Log In
            </Button>
          </div>

          {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}

          {signUp ? (
            <form onSubmit={handleSignUp}>
              <div className='mb-4'>
                <Text><label htmlFor='fullName'>Full Name</label></Text>
                <Input id='fullName' name='fullName' value={signUpForm.fullName} onChange={handleChangeSignUp} className='w-full border p-2 rounded' />
              </div>
              <div className='mb-4'>
                <Text><label htmlFor='email'>Email</label></Text>
                <Input type='email' id='email' name='email' value={signUpForm.email} onChange={handleChangeSignUp} className='w-full border p-2 rounded' />
              </div>
              <div className='mb-4'>
                <Text><label htmlFor='password'>Password</label></Text>
                <Input type='password' id='password' name='password' value={signUpForm.password} onChange={handleChangeSignUp} className='w-full border p-2 rounded' />
              </div>
              <div className='mb-4'>
                <Text><label htmlFor='confirmPassword'>Confirm Password</label></Text>
                <Input type='password' id='confirmPassword' name='confirmPassword' value={signUpForm.confirmPassword} onChange={handleChangeSignUp} className='w-full border p-2 rounded' />
              </div>
              <Button type='submit' className='w-full bg-blue-500 text-white p-2 rounded'>Sign Up</Button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className='mb-4'>
                <Text><label htmlFor='email'>Email</label></Text>
                <Input type='email' id='email' name='email' value={loginForm.email} onChange={handleChangeLogin} className='w-full border p-2 rounded' />
              </div>
              <div className='mb-4'>
                <Text><label htmlFor='password'>Password</label></Text>
                <Input type='password' id='password' name='password' value={loginForm.password} onChange={handleChangeLogin} className='w-full border p-2 rounded' />
              </div>
              <Button type='submit' className='w-full bg-blue-500 text-white p-2 rounded'>Log In</Button>
            </form>
          )}

          <div className='text-center mt-4'>
            {signUp ? (
              <p>
                Already have an account? <button className='text-blue-500' onClick={() => setSignUp(false)}>Log In</button>
              </p>
            ) : (
              <p>
                Don"t have an account? <button className='text-blue-500' onClick={() => setSignUp(true)}>Sign Up</button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
