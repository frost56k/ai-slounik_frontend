import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Container, Paper, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const App = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [error, setError] = useState(''); // Состояние ошибки

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        setResponse('');
    
        try {
            const res = await fetch('https://slounik.andchar.of.by/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                setResponse(data.response);
            } else {
                throw new Error(data.error || 'Произошла ошибка. Пожалуйста, попробуйте позже.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setError(error.message || 'Произошла ошибка. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };      

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        AI.Слоўнік
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h4" gutterBottom>
                        Тлумачальны слоўнік
                    </Typography>
                    <TextField
                        label="Увядзіце ваш запыт"
                        variant="outlined"
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress} // Добавляем обработчик события onKeyPress
                        style={{ marginBottom: '20px' }}
                        disabled={isLoading} // Блокируем поле ввода во время загрузки
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isLoading || !input.trim()} // Блокируем кнопку, если поле пустое или идет загрузка
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Адправіць'}
                    </Button>

                    {/* Отображение ошибки */}
                    {error && (
                        <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
                            {error}
                        </Typography>
                    )}

                    {/* Отображение ответа */}
                    {response && (
                        <Typography variant="body1" style={{ marginTop: '20px' }}>
                            <ReactMarkdown>
                                {response}
                            </ReactMarkdown>
                        </Typography>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default App;
