import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Paper, Typography, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const Translation = ({ switchToDictionary }) => {
    const [text, setText] = useState('');
    const [targetLang, setTargetLang] = useState('en');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const languages = [
        { code: 'en', name: 'Англійская' },
        { code: 'ru', name: 'Русская' },
        { code: 'pl', name: 'Польская' },
        { code: 'uk', name: 'Украінская' }
    ];

    const handleTranslate = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
           const res = await fetch('https://ai-slounik.andchar.of.by/api/translate', {
         //    const res = await fetch('http://127.0.0.1:5000/api/translate', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, target_lang: targetLang }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Памылка перакладу');
            }

            const data = await res.json();

            setImageUrl(data.image_url);
            setTranslation(data.translation);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [text, targetLang]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter' && text.trim()) {
                handleTranslate();
            }
        };

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [text, handleTranslate]);

    return (
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Пераклад слоў
            </Typography>

            <Button
                variant="outlined"
                onClick={switchToDictionary}
                style={{ marginBottom: '20px' }}
            >
                Назад да слоўніка
            </Button>

            <TextField
                label="Увядзіце тэкст на беларускай"
                variant="outlined"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Мова перакладу</InputLabel>
                <Select
                    value={targetLang}
                    label="Мова перакладу"
                    onChange={(e) => setTargetLang(e.target.value)}
                >
                    {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleTranslate}
                disabled={isLoading || !text.trim()}
                fullWidth
            >
                {isLoading ? <CircularProgress size={24} /> : 'Перакласці'}
            </Button>

            {error && (
                <Typography color="error" style={{ marginTop: '20px' }}>
                    {error}
                </Typography>
            )}

            {translation && (
                <>
                    <div style={{ marginTop: '20px' }}>
                        <ReactMarkdown>
                            {translation}
                        </ReactMarkdown>
                    </div>

                    {imageUrl && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <img
                                src={imageUrl}
                                alt={text}
                                style={{ maxWidth: '100%', borderRadius: '8px' }}
                            />
                        </div>
                    )}
                </>
            )}

        </Paper>
    );
};

export default Translation;
