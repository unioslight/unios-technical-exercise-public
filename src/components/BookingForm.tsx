import React from 'react';
import { ThemeUICSSObject } from '@theme-ui/css';
import { Box, Heading } from '@theme-ui/components';
import { Label, Input, Select, Button } from 'theme-ui';
import { SessionDay } from '@/domain/session';
import { Teacher, Room } from '@prisma/client';

const range = (length) => Array.from(Array(length).keys()).map((i) => ++i);
const hours = range(24);
const days: SessionDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const labelStyle: ThemeUICSSObject = { display: 'block', mt: 4, mb: 2 };

export const BookingForm = (): JSX.Element => {
    // Task 1
    // Replace these temporary empty arrays with real data
    // Populate within the form

    const teachers: Teacher[] = [];
    const rooms: Room[] = [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formObj = {};
        formData.forEach((value, key) => (formObj[key] = value));

        //Submit to booking endpoint
        try {
            const response = await fetch('/api/lessons', {
                method: 'POST',
                body: JSON.stringify(formObj),
            });
            const data = await response.json();

            if (data.success) {
                alert('Booking successful');
            } else {
                alert(`Booking failed: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <Box p={8} sx={{ maxWidth: 900, mx: 'auto' }}>
            <Heading mb={6}>Schedule a new lesson</Heading>
            <Box as="form" onSubmit={handleSubmit}>
                <Label sx={labelStyle} htmlFor="name">
                    Class Name
                </Label>
                <Input name="name" id="name" mb={3} autoComplete="off" />
                <Label sx={labelStyle} htmlFor="teacher">
                    Teacher
                </Label>
                <Select name="teacher" id="teacher" mb={3}>
                    <option value="">Select an option...</option>
                </Select>
                <Label sx={labelStyle} htmlFor="day">
                    Day
                </Label>
                <Select name="day" id="day" mb={3}>
                    <option value="">Select an option...</option>
                    {days?.map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </Select>
                <Label sx={labelStyle} htmlFor="hour">
                    Start hour
                </Label>
                <Select name="hour" id="hour" mb={3}>
                    <option value="">Select an option...</option>
                    {hours?.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}:00
                        </option>
                    ))}
                </Select>
                <Label sx={labelStyle} htmlFor="room">
                    Room
                </Label>
                <Select name="room" id="room" mb={3}>
                    <option value="">Select a room...</option>
                </Select>
                <Button sx={{ mt: 6 }}>Submit</Button>
            </Box>
        </Box>
    );
};

BookingForm.displayName = 'BookingForm';
