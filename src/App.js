import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Container, Paper, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Translation from './Translation';

const App = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('dictionary');


    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        setResponse('');

    
        try {
            const res = await fetch('https://ai-slounik.andchar.of.by/api/query', {
               // const res = await fetch('http://127.0.0.1:5000/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Убедитесь, что этот заголовок присутствует
                },
                body: JSON.stringify({ input }),  // Используйте значение из состояния input
            });
    
            // Проверка статуса ответа
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Произошла ошибка. Пожалуйста, попробуйте позже.');
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        AI.Слоўнік
                    </Typography>
                    <Button 
                        color="inherit"
                        onClick={() => setCurrentView(current => 
                            current === 'dictionary' ? 'translation' : 'dictionary'
                        )}
                    >
                        {currentView === 'dictionary' ? 'Пераклад' : 'Слоўнік'}
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                {currentView === 'dictionary' ? (
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Тлумачальны слоўнік
                        </Typography>
                        <TextField
                            label="Увядзіце ваш запыт"
                            variant="outlined"
                            fullWidth
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={{ marginBottom: '20px' }}
                            disabled={isLoading}
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSubmit}
                            fullWidth
                            disabled={isLoading || !input.trim()}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Адправіць'}
                        </Button>

                        {error && (
                            <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
                                {error}
                            </Typography>
                        )}

                        {response && (
                            <Typography component="div" style={{ marginTop: '20px' }}>
                                <ReactMarkdown>
                                   {response}
                                </ReactMarkdown>
                             
                            </Typography>
                            
                        )}
                    </Paper>
                ) : (
                    <Translation switchToDictionary={() => setCurrentView('dictionary')} />
                )}
            </Container>
        </>
    );
};

export default App;