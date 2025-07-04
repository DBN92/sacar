
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, User, Order, ChatMessage } from './types';
import { generateProductDescription, getChatResponse } from './services/geminiService';

// ICONS (Heroicons)
const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.103-.844l1.3-4.5A1.125 1.125 0 0 0 18 8.25h-5.25m-6.75 6h9m-9 0a3 3 0 0 1-3-3h15.75m-15.75 0h3.75c.621 0 1.125-.504 1.125-1.125V6.75m-3.75 0h3.75m-3.75 0h4.5m2.25 0V5.25A2.25 2.25 0 0 0 9.75 3H4.5M12 15.75h3.75" />
    </svg>
);
const UserCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);
const PawPrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M7.5 2.25a.75.75 0 0 0-1.5 0v1.502c-.886.06-1.73.235-2.528.522a.75.75 0 0 0-.472 1.341c1.232.723 2.235 1.733 3.016 2.924.47-1.42.92-2.838 1.354-4.251A.75.75 0 0 0 7.5 2.25ZM5.603 6.313a.75.75 0 0 0-1.113-1.002 9.002 9.002 0 0 0-2.352 4.225.75.75 0 0 0 .193 1.002l.001.001c.219.16.48.243.743.243.21 0 .42-.057.616-.172a8.95 8.95 0 0 0 1.912-1.226C5.603 8.71 5.603 7.509 5.603 6.313ZM12 2.25a.75.75 0 0 0-.75.75v5.02c0 .825-.375 1.6-.998 2.113a.75.75 0 0 0 .998 1.224 4.48 4.48 0 0 0 2.246-1.928c.367.666.77 1.322 1.212 1.978a.75.75 0 1 0 1.299-.75C15.341 8.87 14.16 6.36 12.75 3.998A.75.75 0 0 0 12 2.25ZM16.397 5.313a.75.75 0 0 0-1.114 1.002c0 1.2 0 2.398.001 3.596a8.95 8.95 0 0 0 1.912 1.226c.394.23.882.23.275 0 .219-.16.48-.243.743-.243.21 0 .42.057.616-.172l.001-.001a.75.75 0 0 0 .193-1.002 9.002 9.002 0 0 0-2.352-4.225ZM8.625 15a.75.75 0 0 0-1.5 0v.518a.75.75 0 0 0 1.5 0v-.518Z" clipRule="evenodd" />
        <path d="M10.875 18a.75.75 0 0 0-1.5 0V21a.75.75 0 0 0 1.5 0v-3Zm3.75 0a.75.75 0 0 0-1.5 0V21a.75.75 0 0 0 1.5 0v-3Z" />
        <path fillRule="evenodd" d="M12 12.75a3.75 3.75 0 0 0-3.75 3.75v3a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75v-3A3.75 3.75 0 0 0 12 12.75Zm-2.25 3.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" clipRule="evenodd" />
    </svg>
);
const ChatBubbleOvalLeftEllipsisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.761 9.761 0 0 1-2.541-.358m-4.002 2.643a1.5 1.5 0 0 1 .517-1.737l4.898-3.048a1.5 1.5 0 0 1 2.256 1.077Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8.982 8.982 0 0 0-2.025-5.525a8.983 8.983 0 0 0-5.525-2.025m-7.013 2.025A8.983 8.983 0 0 0 3 12m0 0a8.983 8.983 0 0 0 2.025 5.525m5.525 2.025a8.983 8.983 0 0 0 5.525-2.025" />
    </svg>
);
const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);
const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);
const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


// MOCK DATA
const INITIAL_PRODUCTS: Product[] = [
    { id: 'prod1', name: 'Receita de Salmão Sem Grãos', description: 'Uma fórmula deliciosa e sem grãos, rica em salmão de verdade para uma pele saudável e uma pelagem brilhante.', price: 59.99, imageUrl: 'https://picsum.photos/seed/petfood1/400/400', stock: 50 },
    { id: 'prod2', name: 'Fórmula de Frango e Arroz Integral para Filhotes', description: 'Especialmente formulada para filhotes em crescimento, com DHA para o desenvolvimento cerebral e proteína de alta qualidade para músculos fortes.', price: 45.50, imageUrl: 'https://picsum.photos/seed/petfood2/400/400', stock: 30 },
    { id: 'prod3', name: 'Receita de Cordeiro Vitalidade Sênior', description: 'Ajuda cães idosos com glucosamina e condroitina para a saúde das articulações e antioxidantes para um sistema imunológico forte.', price: 52.00, imageUrl: 'https://picsum.photos/seed/petfood3/400/400', stock: 42 },
    { id: 'prod4', name: 'Controle de Bolas de Pelo para Gatos de Apartamento', description: 'Mistura de fibras naturais que ajuda a controlar bolas de pelo, enquanto minerais balanceados apoiam a saúde urinária de gatos que vivem em ambientes internos.', price: 38.99, imageUrl: 'https://picsum.photos/seed/petfood4/400/400', stock: 65 },
];


// HELPER COMPONENTS (defined outside main App to prevent re-creation on re-render)

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-semibold text-brand-text truncate">{product.name}</h3>
            <p className="text-sm text-brand-muted mt-1 h-10">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-brand-primary">R${product.price.toFixed(2).replace('.',',')}</span>
                <button
                    onClick={() => onAddToCart(product)}
                    className="bg-brand-secondary text-white px-4 py-2 rounded-full font-semibold text-sm transform transition-transform duration-200 group-hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}
                </button>
            </div>
        </div>
    </div>
);


const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init1', text: "Olá! Eu sou o Patitas, seu assistente de IA amigável. Como posso ajudar hoje?", sender: 'ai' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatboxRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { id: Date.now().toString(), text: userInput, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const aiResponseText = await getChatResponse(messages, userInput);
        
        const newAiMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
        setMessages(prev => [...prev, newAiMessage]);
        setIsLoading(false);
    };

    return (
        <>
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-brand-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    aria-label="Abrir Chat"
                >
                    {isOpen ? <XMarkIcon /> : <ChatBubbleOvalLeftEllipsisIcon />}
                </button>
            </div>
            {isOpen && (
                <div className="fixed bottom-20 right-5 w-80 h-[28rem] bg-white rounded-lg shadow-2xl z-40 flex flex-col transform transition-all duration-300 origin-bottom-right">
                    <header className="bg-brand-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-bold">Converse com o Patitas</h3>
                        <button onClick={() => setIsOpen(false)}><XMarkIcon /></button>
                    </header>
                    <div ref={chatboxRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-secondary text-white' : 'bg-gray-200 text-brand-text'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-brand-text p-3 rounded-lg">
                                    <div className="flex items-center space-x-1">
                                       <span className="text-sm">Patitas está digitando</span>
                                       <span className="w-1 h-1 bg-brand-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                       <span className="w-1 h-1 bg-brand-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                       <span className="w-1 h-1 bg-brand-muted rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex items-center bg-white rounded-b-lg">
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder="Pergunte algo..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" className="ml-2 p-2 bg-brand-primary text-white rounded-full hover:bg-brand-dark disabled:bg-gray-400" disabled={isLoading}>
                            <PaperAirplaneIcon />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};


// PAGES

const HomePage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => (
    <div className="text-center">
        <div className="bg-brand-light py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold text-brand-primary">Patas Felizes, Comida Saudável.</h1>
                <p className="mt-4 text-lg text-brand-muted">A melhor nutrição para o seu melhor amigo, entregue na sua porta. Fresca, completa e 'patasticamente' deliciosa.</p>
                <button onClick={() => navigateTo('store')} className="mt-8 bg-brand-secondary text-white px-8 py-3 rounded-full font-bold text-lg transform hover:scale-105 transition-transform duration-300">
                    Compre Agora
                </button>
            </div>
        </div>
        <div className="py-16 px-4">
             <h2 className="text-3xl font-bold text-brand-text mb-8">Por que escolher a Despensa Pet?</h2>
             <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-primary">Entregas Agendadas</h3>
                    <p className="mt-2 text-brand-muted">Nunca mais fique sem ração. Defina uma agenda e nós entregamos automaticamente.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-primary">Suporte com IA</h3>
                    <p className="mt-2 text-brand-muted">Obtenha respostas instantâneas para suas perguntas com nosso assistente de chat inteligente, o Patitas.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-primary">Ingredientes de Qualidade</h3>
                    <p className="mt-2 text-brand-muted">Nós selecionamos apenas os melhores e mais saudáveis ingredientes para os membros peludos da sua família.</p>
                </div>
             </div>
        </div>
    </div>
);

const StorePage: React.FC<{
    products: Product[];
    cart: CartItem[];
    addToCart: (product: Product) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    placeOrder: (deliveryDate: string, deliveryTime: string) => void;
    currentUser: User | null;
}> = ({ products, cart, addToCart, updateCartQuantity, removeFromCart, placeOrder, currentUser }) => {
    const [view, setView] = useState<'catalog' | 'cart' | 'checkout' | 'confirmation'>('catalog');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('09:00 - 12:00');
    
    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const handlePlaceOrder = () => {
        placeOrder(deliveryDate, deliveryTime);
        setView('confirmation');
    };

    if (!currentUser) {
        return <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-brand-text">Por favor, faça o login</h2>
            <p className="text-brand-muted mt-2">Você precisa estar logado para comprar e fazer pedidos.</p>
        </div>;
    }

    if (view === 'catalog') {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-text">Nossos Produtos</h1>
                    <button onClick={() => setView('cart')} className="relative text-brand-primary hover:text-brand-dark">
                        <ShoppingCartIcon />
                        {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((count, item) => count + item.quantity, 0)}</span>}
                    </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
                </div>
            </div>
        );
    }

    if (view === 'cart') {
        return (
            <div>
                <h1 className="text-3xl font-bold text-brand-text mb-8">Seu Carrinho</h1>
                {cart.length === 0 ? (
                    <p>Seu carrinho está vazio. <button onClick={() => setView('catalog')} className="text-brand-primary font-semibold">Comece a comprar!</button></p>
                ) : (
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                    <div>
                                        <h3 className="font-semibold text-brand-text">{item.name}</h3>
                                        <p className="text-sm text-brand-muted">R${item.price.toFixed(2).replace('.',',')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input type="number" value={item.quantity} onChange={e => updateCartQuantity(item.id, parseInt(e.target.value))} min="1" max={item.stock} className="w-16 border-gray-300 rounded-md text-center" />
                                    <p className="font-bold w-24 text-right">R${(item.price * item.quantity).toFixed(2).replace('.',',')}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                </div>
                            </div>
                        ))}
                        <div className="text-right mt-8">
                            <h2 className="text-2xl font-bold">Total: R${cartTotal.toFixed(2).replace('.',',')}</h2>
                            <button onClick={() => setView('checkout')} className="mt-4 bg-brand-primary text-white px-6 py-2 rounded-full font-bold">Ir para o Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    if (view === 'checkout') {
        return (
            <div>
                <h1 className="text-3xl font-bold text-brand-text mb-8">Checkout e Agendamento da Entrega</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Agende sua Entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-medium text-brand-muted">Data da Entrega</label>
                            <input type="date" id="deliveryDate" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="deliveryTime" className="block text-sm font-medium text-brand-muted">Horário da Entrega</label>
                            <select id="deliveryTime" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary">
                                <option>09:00 - 12:00</option>
                                <option>12:00 - 15:00</option>
                                <option>15:00 - 18:00</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-4">
                        <h3 className="text-lg font-semibold">Resumo do Pedido</h3>
                        <p className="text-brand-muted">Total de Itens: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        <p className="text-2xl font-bold mt-2">Total: R${cartTotal.toFixed(2).replace('.',',')}</p>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={!deliveryDate} className="mt-6 w-full bg-brand-secondary text-white py-3 rounded-full font-bold text-lg disabled:bg-gray-400">Finalizar Pedido e Agendar</button>
                </div>
            </div>
        );
    }

    if (view === 'confirmation') {
        const whatsappMessage = encodeURIComponent(`Olá! Acabei de fazer um pedido na Despensa Pet. Minha entrega está agendada para ${deliveryDate} entre ${deliveryTime}. Obrigado!`);
        const whatsappLink = `https://wa.me/?text=${whatsappMessage}`; // Using a generic link without a number
        
        return (
            <div className="text-center bg-white p-10 rounded-lg shadow-xl max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-green-500 mb-4">Obrigado!</h1>
                <p className="text-lg text-brand-text">Seu pedido foi confirmado.</p>
                <p className="mt-2 text-brand-muted">Sua entrega está agendada para <strong>{deliveryDate}</strong> entre <strong>{deliveryTime}</strong>.</p>
                <div className="mt-8 space-y-4">
                    <p>Um e-mail de confirmação foi enviado. Você também pode enviar uma confirmação via WhatsApp.</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold">
                        Confirmar no WhatsApp
                    </a>
                </div>
                 <button onClick={() => setView('catalog')} className="mt-8 text-brand-primary font-semibold">Continuar Comprando</button>
            </div>
        );
    }

    return null;
};


const AdminPage: React.FC<{
    products: Product[];
    orders: Order[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
}> = ({ products, orders, addProduct, updateProduct, deleteProduct }) => {
    const [view, setView] = useState<'products' | 'orders'>('products');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: 0, imageUrl: '', stock: 0 });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if(editingProduct) {
            setProductForm({
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                imageUrl: editingProduct.imageUrl,
                stock: editingProduct.stock
            });
        } else {
            setProductForm({ name: '', description: '', price: 0, imageUrl: 'https://picsum.photos/seed/newproduct/400/400', stock: 0 });
        }
    }, [editingProduct]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
    };

    const handleGenerateDesc = async () => {
        if (!productForm.name) {
            alert("Por favor, insira o nome do produto primeiro.");
            return;
        }
        setIsGenerating(true);
        const desc = await generateProductDescription(productForm.name, "saudável, natural, premium");
        setProductForm(prev => ({...prev, description: desc}));
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            updateProduct({ ...editingProduct, ...productForm });
        } else {
            addProduct(productForm);
        }
        setEditingProduct(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text mb-4">Painel do Administrador</h1>
            <div className="flex space-x-4 border-b mb-8">
                <button onClick={() => setView('products')} className={`py-2 px-4 ${view === 'products' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-muted'}`}>Produtos</button>
                <button onClick={() => setView('orders')} className={`py-2 px-4 ${view === 'orders' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-muted'}`}>Pedidos</button>
            </div>

            {view === 'products' && (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="name" placeholder="Nome do Produto" value={productForm.name} onChange={handleFormChange} className="w-full border-gray-300 rounded-md" required />
                            <div className="relative">
                               <textarea name="description" placeholder="Descrição" value={productForm.description} onChange={handleFormChange} className="w-full border-gray-300 rounded-md" rows={4} required />
                               <button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="absolute bottom-2 right-2 text-xs bg-brand-primary text-white px-2 py-1 rounded-md hover:bg-brand-dark disabled:bg-gray-400">
                                  {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                               </button>
                            </div>
                            <input type="number" step="0.01" name="price" placeholder="Preço" value={productForm.price} onChange={handleFormChange} className="w-full border-gray-300 rounded-md" required />
                            <input type="number" name="stock" placeholder="Estoque" value={productForm.stock} onChange={handleFormChange} className="w-full border-gray-300 rounded-md" required />
                            <input type="text" name="imageUrl" placeholder="URL da Imagem" value={productForm.imageUrl} onChange={handleFormChange} className="w-full border-gray-300 rounded-md" required />
                            <div className="flex space-x-2">
                                <button type="submit" className="flex-1 bg-brand-secondary text-white py-2 rounded-md font-semibold">{editingProduct ? 'Atualizar' : 'Adicionar'}</button>
                                {editingProduct && <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-300 py-2 rounded-md">Cancelar</button>}
                            </div>
                        </form>
                    </div>
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Inventário</h2>
                        <div className="space-y-2">
                            {products.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-2 border-b">
                                    <span>{p.name} ({p.stock} em estoque)</span>
                                    <div className="space-x-2">
                                        <button onClick={() => setEditingProduct(p)} className="text-sm text-blue-500">Editar</button>
                                        <button onClick={() => deleteProduct(p.id)} className="text-sm text-red-500">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
             {view === 'orders' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Pedidos dos Clientes</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">ID do Pedido</th>
                                    <th>ID do Cliente</th>
                                    <th>Data</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} className="border-b">
                                        <td className="py-2 font-mono text-xs">{o.id.substring(0, 8)}</td>
                                        <td className="font-mono text-xs">{o.userId.substring(0, 8)}</td>
                                        <td>{o.deliveryDate}</td>
                                        <td>R${o.total.toFixed(2).replace('.',',')}</td>
                                        <td><span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{o.status}</span></td>
                                    </tr>
                                ))}
                                {orders.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-brand-muted">Nenhum pedido ainda.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};


const AuthPage: React.FC<{ onLogin: (email: string) => void, onRegister: (email: string) => void }> = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(email);
        } else {
            onRegister(email);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-brand-text mb-6">{isLogin ? 'Bem-vindo(a) de volta!' : 'Criar Conta'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                    required 
                />
                <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors">
                    {isLogin ? 'Entrar' : 'Registrar'}
                </button>
            </form>
            <p className="text-center mt-6 text-sm">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-brand-primary ml-1">
                    {isLogin ? 'Cadastre-se' : 'Entrar'}
                </button>
            </p>
            <p className="text-xs text-center text-brand-muted mt-4">Demo: use 'admin@petpantry.com' para entrar como admin.</p>
        </div>
    );
};

// APP COMPONENT
const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('petpantry_user');
        const storedProducts = localStorage.getItem('petpantry_products');
        const storedOrders = localStorage.getItem('petpantry_orders');
        
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            setProducts(INITIAL_PRODUCTS);
            localStorage.setItem('petpantry_products', JSON.stringify(INITIAL_PRODUCTS));
        }
        if(storedOrders) setOrders(JSON.parse(storedOrders));
        
        const cartKey = storedUser ? `petpantry_cart_${JSON.parse(storedUser).id}` : null;
        if(cartKey) {
            const storedCart = localStorage.getItem(cartKey);
            if(storedCart) setCart(JSON.parse(storedCart));
        }

    }, []);
    
    useEffect(() => {
        if(currentUser) {
           const cartKey = `petpantry_cart_${currentUser.id}`;
           localStorage.setItem(cartKey, JSON.stringify(cart));
        }
    }, [cart, currentUser]);


    const handleLogin = (email: string) => {
        const role = email === 'admin@petpantry.com' ? 'admin' : 'customer';
        const user: User = { id: `user_${Date.now()}`, email, role };
        setCurrentUser(user);
        localStorage.setItem('petpantry_user', JSON.stringify(user));
        
        const cartKey = `petpantry_cart_${user.id}`;
        const storedCart = localStorage.getItem(cartKey);
        if(storedCart) setCart(JSON.parse(storedCart)); else setCart([]);

        setCurrentPage(role === 'admin' ? 'admin' : 'home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCart([]);
        localStorage.removeItem('petpantry_user');
        setCurrentPage('home');
    };
    
    const navigateTo = (page: string) => {
        if (page === 'admin' && currentUser?.role !== 'admin') {
            alert('Acesso negado.');
            return;
        }
        if ((page === 'store') && !currentUser) {
            setCurrentPage('auth');
            return;
        }
        setCurrentPage(page);
    };

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if(quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: quantity } : item));
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const placeOrder = (deliveryDate: string, deliveryTime: string) => {
        if(!currentUser) return;
        const newOrder: Order = {
            id: `order_${Date.now()}`,
            userId: currentUser.id,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            deliveryDate,
            deliveryTime,
            status: 'Confirmed',
            createdAt: new Date().toISOString()
        };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('petpantry_orders', JSON.stringify(updatedOrders));

        // Update stock
        const updatedProducts = products.map(p => {
            const cartItem = cart.find(item => item.id === p.id);
            if(cartItem){
                return {...p, stock: p.stock - cartItem.quantity}
            }
            return p;
        });
        setProducts(updatedProducts);
        localStorage.setItem('petpantry_products', JSON.stringify(updatedProducts));

        setCart([]);
    };

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct = { ...productData, id: `prod_${Date.now()}`};
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        localStorage.setItem('petpantry_products', JSON.stringify(updatedProducts));
    };

    const updateProduct = (updatedProduct: Product) => {
        const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        setProducts(updatedProducts);
        localStorage.setItem('petpantry_products', JSON.stringify(updatedProducts));
    };

    const deleteProduct = (productId: string) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('petpantry_products', JSON.stringify(updatedProducts));
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'store':
                return <StorePage products={products} cart={cart} addToCart={addToCart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} placeOrder={placeOrder} currentUser={currentUser} />;
            case 'admin':
                return <AdminPage products={products} orders={orders} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />;
            case 'auth':
                return <AuthPage onLogin={handleLogin} onRegister={handleLogin} />;
            case 'home':
            default:
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-md sticky top-0 z-20">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-2xl font-bold text-brand-primary">
                        <PawPrintIcon />
                        Despensa Pet
                    </button>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigateTo('home')} className="text-brand-muted hover:text-brand-primary">Início</button>
                        <button onClick={() => navigateTo('store')} className="text-brand-muted hover:text-brand-primary">Loja</button>
                        {currentUser?.role === 'admin' && <button onClick={() => navigateTo('admin')} className="text-brand-muted hover:text-brand-primary font-semibold">Admin</button>}
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigateTo('store')} className="relative text-brand-muted hover:text-brand-primary">
                                <ShoppingCartIcon />
                                {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>}
                            </button>
                            {currentUser ? (
                                <button onClick={handleLogout} className="text-brand-muted hover:text-brand-primary">Sair</button>
                            ) : (
                                <button onClick={() => navigateTo('auth')} className="text-brand-muted hover:text-brand-primary"><UserCircleIcon /></button>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-8">
                {renderPage()}
            </main>
            
            <ChatWidget />

            <footer className="bg-brand-dark text-brand-light mt-16">
                <div className="container mx-auto px-4 py-6 text-center">
                    <p>&copy; {new Date().getFullYear()} Despensa Pet. Todos os direitos reservados.</p>
                    <p className="text-sm text-indigo-300">Nutrindo Pets, Uma Tigela de Cada Vez.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
