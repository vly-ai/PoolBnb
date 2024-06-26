import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IPool } from '../../models/Pool';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Field, FieldGroup, TextField, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Checkbox, CheckboxField } from '@/components/checkbox';
import { Button } from '@/components/button';
import { Link } from '@/components/link';

const ListPool = () => {
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [availability, setAvailability] = useState<{ startDate: Date; endDate: Date }[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const router = useRouter();

  const onPhotoDrop = (acceptedFiles: File[]) => {
    setPhotos([...photos, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onPhotoDrop });

  const addAvailability = () => {
    setAvailability([...availability, { startDate: new Date(), endDate: new Date() }]);
  };

  const updateAvailability = (index: number, dateType: 'startDate' | 'endDate', date: Date) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][dateType] = date;
    setAvailability(updatedAvailability);
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAmenities([...amenities, value]);
    } else {
      setAmenities(amenities.filter(amenity => amenity !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    formData.append('name', name);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('availability', JSON.stringify(availability));
    formData.append('amenities', JSON.stringify(amenities));

    try {
      await axios.post('/api/pools/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/user/dashboard');
    } catch (error) {
      console.error('Failed to create pool', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar>
        <NavbarSection>
          <Link href='/'>PoolBnb</Link>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href='/'>Home</NavbarItem>
          <NavbarItem href='/listings'>Listings</NavbarItem>
          <NavbarItem href='/user/dashboard'>Dashboard</NavbarItem>
          <NavbarItem href='/logout'>Log Out</NavbarItem>
        </NavbarSection>
      </Navbar>

      <main className='flex-grow container mx-auto p-4'>
        <h1 className='text-2xl mb-4'>List a Pool</h1>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label>Pool Name</Label>
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label>Location</Label>
              <Input
                type='text'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label>Price per Hour</Label>
              <Input
                type='number'
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </Field>
          </FieldGroup>

          <Fieldset>
            <Legend>Availability</Legend>
            <Button type='button' onClick={addAvailability}>Add Availability</Button>
            {availability.map((slot, index) => (
              <FieldGroup key={index} className='mt-2'>
                <Field>
                  <Label>Start Date</Label>
                  <DatePicker
                    selected={slot.startDate}
                    onChange={(date: Date) => updateAvailability(index, 'startDate', date)}
                    className='border border-gray-300 rounded'
                    required
                  />
                </Field>
                <Field>
                  <Label>End Date</Label>
                  <DatePicker
                    selected={slot.endDate}
                    onChange={(date: Date) => updateAvailability(index, 'endDate', date)}
                    className='border border-gray-300 rounded'
                    required
                  />
                </Field>
              </FieldGroup>
            ))}
          </Fieldset>

          <Fieldset>
            <Legend>Amenities</Legend>
            <CheckboxField>
              <Checkbox
                value='WiFi'
                onChange={handleAmenityChange}
              />
              <Label>WiFi</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                value='Parking'
                onChange={handleAmenityChange}
              />
              <Label>Parking</Label>
            </CheckboxField>
            <CheckboxField>
              <Checkbox
                value='Heated Pool'
                onChange={handleAmenityChange}
              />
              <Label>Heated Pool</Label>
            </CheckboxField>
            {/* Add more amenities as needed */}
          </Fieldset>

          <Field>
            <Label>Photos</Label>
            <div {...getRootProps({ className: 'border-dashed border-2 border-gray-300 p-6 rounded' })}>
              <input {...getInputProps()} />
              <p className='text-center'>Drag 'n' drop some photos here, or click to select files</p>
            </div>
            <div className='mt-2'>
              {photos.map((file, index) => (
                <div key={index} className='text-sm'>{file.name}</div>
              ))}
            </div>
          </Field>

          <Button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>Submit</Button>
        </form>
      </main>

      <footer className='bg-gray-800 text-white p-4'>
        <div className='container mx-auto flex justify-between'>
          <div>Contact Information</div>
          <div>
            <Link href='#' className='mr-4'>Terms of Service</Link>
            <Link href='#'>Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ListPool;