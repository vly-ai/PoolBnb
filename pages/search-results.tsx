import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { IPool } from '../models/Pool';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Pagination, PaginationPrevious, PaginationNext, PaginationList, PaginationPage, PaginationGap } from '@/components/pagination';

const SearchResults = () => {
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pools, setPools] = useState<IPool[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const fetchPools = async () => {
    try {
      const response = await axios.get('/api/pools/search', {
        params: {
          location,
          startDate,
          endDate,
          priceRange,
          features,
        },
      });
      setPools(response.data);
    } catch (error) {
      console.error('Error fetching pools:', error);
    }
  };

  const handleSortFilter = async () => {
    try {
      const response = await axios.get('/api/pools/sort-filter', {
        params: {
          sortBy,
          order,
          priceRange,
          features,
        },
      });
      setPools(response.data);
    } catch (error) {
      console.error('Error sorting and filtering pools:', error);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [location, startDate, endDate, priceRange, features]);

  return (
    <div className='container mx-auto px-4'>
      <Navbar>
        <NavbarSection>
          <Link href='/'>
            <NavbarItem>PoolBnb</NavbarItem>
          </Link>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <Link href='/' className='mr-4'>
            <NavbarItem>Home</NavbarItem>
          </Link>
          <Link href='/sign-up' className='mr-4'>
            <NavbarItem>Sign Up</NavbarItem>
          </Link>
          <Link href='/log-in'>
            <NavbarItem>Log In</NavbarItem>
          </Link>
        </NavbarSection>
      </Navbar>
      <div className='my-6'>
        <div className='flex mb-4'>
          <Input
            type='text'
            placeholder='Location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='border p-2 mr-2'
          />
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            placeholderText='Start Date'
            className='border p-2 mr-2'
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            placeholderText='End Date'
            className='border p-2'
          />
        </div>
        <div className='flex mb-4'>
          <Input
            type='number'
            placeholder='Min Price'
            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
            className='border p-2 mr-2'
          />
          <Input
            type='number'
            placeholder='Max Price'
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className='border p-2'
          />
        </div>
        <div className='mb-4'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='border p-2 mr-2'
          >
            <option value=''>Sort By</option>
            <option value='price'>Price</option>
            <option value='location'>Location</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className='border p-2'
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </div>
        <Button onClick={handleSortFilter} color='indigo'>Apply Filters</Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {pools.map((pool) => (
          <Card key={pool._id} className='border p-4'>
            <img src={pool.photos[0]} alt={pool.name} className='w-full h-48 object-cover mb-2' />
            <h2 className='text-xl font-bold'>{pool.name}</h2>
            <p>{pool.location}</p>
            <p>${pool.price}/hour</p>
            <Link href={`/pool/${pool._id}`} className='text-blue-500'>View Details</Link>
          </Card>
        ))}
      </div>
      <Pagination className='flex justify-center mt-4'>
        <PaginationPrevious>Previous</PaginationPrevious>
        <PaginationList>
          <PaginationPage>1</PaginationPage>
          <PaginationPage>2</PaginationPage>
          <PaginationPage>3</PaginationPage>
          <PaginationGap />
          <PaginationPage>65</PaginationPage>
          <PaginationPage>66</PaginationPage>
        </PaginationList>
        <PaginationNext>Next</PaginationNext>
      </Pagination>
    </div>
  );
};

export default SearchResults;