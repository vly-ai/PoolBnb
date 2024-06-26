import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { IPool } from '../../models/Pool';
import { IReview } from '../../models/Review';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Alert, AlertBody, AlertDescription } from '@/components/alert';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/description-list';
import { Divider } from '@/components/divider';
import { Text } from '@/components/text';

interface PoolDetails {
  pool: IPool;
  reviews: IReview[];
}

const PoolPage: React.FC<PoolDetails> = ({ pool, reviews }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const router = useRouter();

  const checkAvailability = async () => {
    try {
      const response = await axios.post(`/api/pools/${pool._id}/availability`, {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });
      setIsAvailable(response.data.available);
    } catch (error) {
      console.error('Error checking availability', error);
    }
  };

  const bookPool = async () => {
    try {
      const response = await axios.post(`/api/pools/${pool._id}/book`, {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        guests,
      });
      if (response.status === 201) {
        router.push('/user/dashboard');
      }
    } catch (error) {
      console.error('Error booking pool', error);
    }
  };

  const handleStartDateChange = (date: Date) => setStartDate(date);
  const handleEndDateChange = (date: Date) => setEndDate(date);
  const handleGuestsChange = (event: React.ChangeEvent<HTMLSelectElement>) => setGuests(parseInt(event.target.value));

  return (
    <div>
      <Navbar>
        <NavbarSection>
          <Link href='/' passHref legacyBehavior><NavbarItem>Home</NavbarItem></Link>
          <Link href='/sign-up' passHref legacyBehavior><NavbarItem>Sign Up</NavbarItem></Link>
          <Link href='/sign-in' passHref legacyBehavior><NavbarItem>Sign In</NavbarItem></Link>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <Avatar className='size-8' initials='U' />
        </NavbarSection>
      </Navbar>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <img src={pool.photos[0]} alt={pool.name} className='w-full h-64 object-cover rounded-md' />
            <div className='mt-4'>
              <h1 className='text-3xl font-bold'>{pool.name}</h1>
              <Text>{pool.location}</Text>
              <Text>{pool.reviews.length} Reviews</Text>
              <p>{pool.description}</p>
              <h2 className='text-xl font-semibold mt-4'>Amenities</h2>
              <ul className='list-disc ml-6'>
                {pool.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
            <div className='mt-4'>
              <DescriptionList>
                <DescriptionTerm>Rating</DescriptionTerm>
                <DescriptionDetails>{pool.reviews.length} Reviews</DescriptionDetails>
              </DescriptionList>
              <Divider className='my-4' />
              <h2 className='text-xl font-semibold'>Reviews</h2>
              {reviews.length > 0 ? reviews.map((review, index) => (
                <div key={index} className='mb-4'>
                  <Text>Rating: {review.rating}</Text>
                  <p>{review.comment}</p>
                  <small>{review.date}</small>
                </div>
              )) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
          <div className='border p-4 rounded-md shadow-md'>
            <h2 className='text-xl font-semibold'>Book This Pool</h2>
            <div className='mt-4'>
              <DatePicker selected={startDate} onChange={handleStartDateChange} placeholderText='Start Date' />
              <DatePicker selected={endDate} onChange={handleEndDateChange} placeholderText='End Date' />
            </div>
            <div className='mt-4'>
              <label>Guests</label>
              <Select name='guests' value={guests} onChange={handleGuestsChange}>
                {[...Array(10).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>{num + 1}</option>
                ))}
              </Select>
            </div>
            <div className='mt-4'>
              <Button onClick={checkAvailability} color='blue'>Check Availability</Button>
            </div>
            <div className='mt-4'>
              {isAvailable ? (
                <Button onClick={bookPool} color='green'>Book Now</Button>
              ) : (
                <Alert>
                  <AlertBody>
                    <AlertDescription>Pool is not available for selected dates</AlertDescription>
                  </AlertBody>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { data: pool } = await axios.get(`/api/pools/${params?.pool_id}/details`);
    const { data: reviews } = await axios.get(`/api/pools/${params?.pool_id}/reviews`);
    return { props: { pool, reviews } };
  } catch (error) {
    return { notFound: true };
  }
};

export default PoolPage;
