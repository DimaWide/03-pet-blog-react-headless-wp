import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SinglePost from './components/SinglePost';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/single/Login';
import Register from './components/single/Register';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Suspense } from 'react';
import { UserProvider } from './components/UserContext'; // Импортируем контекст пользователя
import './scss/styles.scss';

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <Router>
                    <div className="wcl-body-inner">
                        <Header />
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/post/:id" element={<SinglePost />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </Suspense>
                        <Footer />
                    </div>
                </Router>
            </UserProvider>
        </QueryClientProvider>
    );
};

export default App;
