export default function CustomStyles() {
    return (
        <style jsx>{`
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            .animate-slide-in-right {
                animation: slideInRight 0.3s ease-out forwards;
            }
            .animate-fade-in {
                animation: fadeIn 0.3s ease-out forwards;
            }
            .scrollbar-thin {
                scrollbar-width: thin;
            }
            .scrollbar-thin::-webkit-scrollbar {
                width: 4px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
                background: #f3f4f6;
                border-radius: 10px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 10px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
            }
        `}</style>
    );
}
