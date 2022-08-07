import React, { useEffect, useState } from 'react';
import { ThemeUICSSObject } from '@theme-ui/css';
import { Box, Heading } from '@theme-ui/components';
import { Label, Input, Select, Button } from 'theme-ui';
import { SessionDay } from '@/domain/session';
import { Teacher, Room } from '@prisma/client';
const range = (length) => Array.from(Array(length).keys()).map((i) => ++i);
const hours = range(24);
const days: SessionDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const labelStyle: ThemeUICSSObject = { display: 'block', mt: 4, mb: 2 };
const fetchData = async (url: string) => {
    try {
        let response = await fetch(url);
        let json = await response.json();
        return { success: true, data: json.data };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const BookingForm = (): JSX.Element => {
    // Task 1
    // Replace these temporary empty arrays with real data
    // Populate within the form
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const [teacherRes, roomRes] = await Promise.all([fetchData('/api/teachers'), fetchData('/api/rooms')]);
            setLoading(false);
            if (teacherRes.success) {
                setTeachers(teacherRes.data);
            }
            if (roomRes.success) {
                setRooms(roomRes.data);
            }
        })();
    }, []);
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
            console.log(response);
            if( response.status === 500 ){
                alert(`Booking failed: ${response.statusText}`);
            }else if( response.status === 201 ){
                alert('Booking successful');
            }else{
                const data = await response.json();
                if (data.success) {
                    alert('Booking successful');
                } else {
                    alert(`Booking failed: ${data.message}`);
                }
            }
        } catch (error) {
            console.error('e=',error);
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
                    {teachers?.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.title} {teacher.name}
                        </option>
                    ))}                    
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
                    {rooms?.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}                                        
                </Select>
                <Button sx={{ mt: 6 }}>Submit</Button>
            </Box>
        </Box>
    );
};
BookingForm.displayName = 'BookingForm';
