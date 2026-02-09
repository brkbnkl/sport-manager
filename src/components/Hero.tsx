interface HeroProps {
    onGetStarted: () => void;
    isAuthenticated: boolean;
}

export default function Hero({ onGetStarted, isAuthenticated }: HeroProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
                        FitTrack Pro
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
                        Kişiselleştirilmiş antrenman planlarıyla fitness hedeflerinize ulaşın
                    </p>
                    <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                        Google hesabınızla giriş yapın, kas grubunuzu seçin, ekipmanlarınızı belirleyin ve size özel antrenman programınızı hemen alın!
                    </p>

                    <button
                        onClick={onGetStarted}
                        className="btn-primary px-12 py-4 rounded-full text-xl font-bold text-white shadow-2xl hover:shadow-indigo-500/50 transition-all"
                    >
                        {isAuthenticated ? 'Antrenman Başlat' : 'Hemen Başla'}
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold mb-2">Kişiselleştirilmiş Planlar</h3>
                        <p className="text-gray-400">
                            Hedeflerinize ve ekipmanlarınıza göre özel antrenman programları
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform" style={{ animationDelay: '0.1s' }}>
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-xl font-bold mb-2">İlerleme Takibi</h3>
                        <p className="text-gray-400">
                            Gelişiminizi görselleştirin ve motivasyonunuzu artırın
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform" style={{ animationDelay: '0.2s' }}>
                        <div className="text-5xl mb-4">🎥</div>
                        <h3 className="text-xl font-bold mb-2">Video Rehberler</h3>
                        <p className="text-gray-400">
                            Her hareket için YouTube video linkleriyle doğru teknik
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
