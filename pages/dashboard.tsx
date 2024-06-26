import { useEffect, useState } from 'react';
import axios from '../../../lib/axiosInstance';
import { IUser } from '../../../models/User';
import { IBooking } from '../../../models/Booking';
import { IPool } from '../../../models/Pool';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Link, Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Sidebar, SidebarBody, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { Field, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Button } from '@/components/button';

const Dashboard = () => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [listings, setListings] = useState<IPool[]>([]);
  const [activeSection, setActiveSection] = useState<'bookings' | 'listings' | 'profile' | 'settings'>('bookings');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/user/profile');
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/user/bookings');
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings');
      }
    };

    const fetchListings = async () => {
      try {
        const { data } = await axios.get('/api/user/listings');
        setListings(data);
      } catch (err) {
        setError('Failed to fetch listings');
      }
    };

    fetchProfile();
    fetchBookings();
    fetchListings();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await axios.put('/api/user/profile', profile);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    // Here you'd normally handle logging out using your auth provider (like NextAuth.js)
    // For now, we just redirect to login page
    router.push('/login');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar>
        <NavbarSection>
          <NavbarItem href='/dashboard'>Dashboard</NavbarItem>
          <NavbarItem href='/listings'>Listings</NavbarItem>
          <NavbarItem href='/profile'>Profile</NavbarItem>
          <Button onClick={handleLogout}>Logout</Button>
        </NavbarSection>
      </Navbar>

      <div className='flex flex-1'>
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem onClick={() => setActiveSection('bookings')}>Bookings</SidebarItem>
              <SidebarItem onClick={() => setActiveSection('listings')}>Listings</SidebarItem>
              <SidebarItem onClick={() => setActiveSection('profile')}>Profile</SidebarItem>
              <SidebarItem onClick={() => setActiveSection('settings')}>Settings</SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>

        <main className='w-3/4 p-4'>
          {error && <p className='text-red-500'>{error}</p>}

          {activeSection === 'bookings' && (
            <div>
              <h2 className='text-xl font-semibold mb-4'>Bookings</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Pool</TableHeader>
                    <TableHeader>Start Date</TableHeader>
                    <TableHeader>End Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.pool}</TableCell>
                      <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeSection === 'listings' && (
            <div>
              <h2 className='text-xl font-semibold mb-4'>Listings</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Location</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader>Availability</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing._id}>
                      <TableCell>{listing.name}</TableCell>
                      <TableCell>{listing.location}</TableCell>
                      <TableCell>${listing.price}</TableCell>
                      <TableCell>{listing.availability.map(a => `${new Date(a.startDate).toLocaleDateString()} - ${new Date(a.endDate).toLocaleDateString()}`).join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeSection === 'profile' && profile && (
            <div>
              <h2 className='text-xl font-semibold mb-4'>Profile</h2>
              <form onSubmit={e => e.preventDefault()}>
                <Field>
                  <Label>Full Name:</Label>
                  <Input type='text' value={profile.fullName} onChange={(e) => setProfile(prev => prev ? { ...prev, fullName: e.target.value } : null)} />
                </Field>
                <Field>
                  <Label>Email:</Label>
                  <Input type='email' value={profile.email} onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)} />
                </Field>
                <Field>
                  <Label>Bio:</Label>
                  <Textarea value={profile.profile.bio} onChange={(e) => setProfile(prev => prev ? { ...prev, profile: { ...prev.profile, bio: e.target.value } } : null)} />
                </Field>
                <Field>
                  <Label>Avatar URL:</Label>
                  <Input type='text' value={profile.profile.avatar} onChange={(e) => setProfile(prev => prev ? { ...prev, profile: { ...prev.profile, avatar: e.target.value } } : null)} />
                </Field>
                <Button type='button' onClick={handleSaveProfile}>Save</Button>
              </form>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h2 className='text-xl font-semibold mb-4'>Settings</h2>
              <p>Settings content goes here...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  await dbConnect();

  // You can add some logic to fetch initial data here if needed

  return {
    props: {}, // will be passed to the page component as props
  };
};