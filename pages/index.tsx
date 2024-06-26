import { useState, useEffect } from 'react';
import axios from '../lib/api/axiosInstance';
import { NextPage } from 'next';
import Link from 'next/link';
import { IPool } from '../models/Pool';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

const HomePage: NextPage = () => {
    const [searchLocation, setSearchLocation] = useState<string>('');
    const [searchStartDate, setSearchStartDate] = useState<string>('');
    const [searchEndDate, setSearchEndDate] = useState<string>('');
    const [featuredPools, setFeaturedPools] = useState<IPool[]>([]);
    const [searchResults, setSearchResults] = useState<IPool[]>([]);

    useEffect(() => {
        const fetchFeaturedPools = async () => {
            try {
                const response = await axios.get('/api/featured-pools');
                setFeaturedPools(response.data);
            } catch (error) {
                console.error('Error fetching featured pools:', error);
            }
        };
        fetchFeaturedPools();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get('/api/pools/search', {
                params: {
                    location: searchLocation,
                    startDate: searchStartDate,
                    endDate: searchEndDate,
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="container mx-auto px-4">
            {/* Header */}
            <Navbar>
                <NavbarSection>
                    <Link href="/">
                        <NavbarItem>PoolBnb</NavbarItem>
                    </Link>
                </NavbarSection>
                <NavbarSpacer />
                <NavbarSection>
                    <Link href="/">
                        <NavbarItem>Home</NavbarItem>
                    </Link>
                    <Link href="/sign-in">
                        <NavbarItem>Login</NavbarItem>
                    </Link>
                    <Link href="/sign-up">
                        <NavbarItem>Sign Up</NavbarItem>
                    </Link>
                </NavbarSection>
            </Navbar>

            {/* Search Bar */}
            <div className="my-8">
                <Input
                    className="mr-2"
                    type="text"
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                />
                <Input
                    className="mr-2"
                    type="date"
                    value={searchStartDate}
                    onChange={(e) => setSearchStartDate(e.target.value)}
                />
                <Input
                    className="mr-2"
                    type="date"
                    value={searchEndDate}
                    onChange={(e) => setSearchEndDate(e.target.value)}
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* Featured Listings */}
            <section>
                <h2 className="text-xl mb-4">Featured Listings</h2>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Location</TableHeader>
                            <TableHeader>Price per hour</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {featuredPools.map(pool => (
                            <TableRow key={pool._id}>
                                <TableCell>{pool.name}</TableCell>
                                <TableCell>{pool.location}</TableCell>
                                <TableCell>{pool.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>

            {/* Search Results */}
            <section className="mt-8">
                <h2 className="text-xl mb-4">Search Results</h2>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Location</TableHeader>
                            <TableHeader>Price per hour</TableHeader>
                            <TableHeader>Details</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.length > 0 ? (
                            searchResults.map(pool => (
                                <TableRow key={pool._id}>
                                    <TableCell>{pool.name}</TableCell>
                                    <TableCell>{pool.location}</TableCell>
                                    <TableCell>{pool.price}</TableCell>
                                    <TableCell>
                                        <Link href={`/pools/${pool._id}`} passHref>
                                            <Button>View Details</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4}>No pools found. Please adjust your search criteria.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </section>
        </div>
    );
};

export default HomePage;