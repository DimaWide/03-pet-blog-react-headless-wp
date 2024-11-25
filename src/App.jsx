// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import BlogPost from './components/BlogPost';
import SinglePost from './components/SinglePost';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/single/Login'; // Компонент страницы входа
import Register from './components/single/Register'; // Компонент страницы регистрации

import { QueryClient, QueryClientProvider } from 'react-query';
import { Suspense } from 'react';
import './scss/styles.scss'; // Добавьте стили при необходимости

// import 'semantic-ui-css/semantic.min.css';

const queryClient = new QueryClient();

const App = () => {
    return (

        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="wcl-body-inner">
                    <Header />
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/post/:id" element={<SinglePost />} />

                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            {/* <Route path="/" exact element={Home} /> */}
                        </Routes>

                    </Suspense>
                    <Footer />
                </div>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
