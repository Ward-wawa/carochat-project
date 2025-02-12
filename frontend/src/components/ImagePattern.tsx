const ImagePattern = ({ title, subtitle }:{title:string,subtitle:string}) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-5 gap-7 mb-8">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-2xl bg-primary/100 ${
                                i % 2 === 0 ? "animate-bounce bg-primary/100" : "animate-pulse bg-primary"
                            }`}
                        />
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
};

export default ImagePattern;