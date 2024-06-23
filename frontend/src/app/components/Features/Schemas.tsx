import UpRightArrowIcon from "@/app/svg/UpRightArrowIcon";

const Schemas = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-8 feature">
            <div className="px-2 md:px-8">
                <h2 className="flex font-serif items-center text-2xl font-semibold gap-2">
                    <span>Schemas</span>
                    <span>
                        <UpRightArrowIcon />
                    </span>
                </h2>
                <p className="text-lg font-serif opacity-75">
                    Schemas are foundational to the EAS ecosystem. They ensure that
                    attestations are consistent, verifiable, and meaningful.
                </p>
            </div>
            <div
                className="md:p-4 grid grid-cols-1 grid-rows-1 feat-img-right"
                aria-hidden
            >
                {/* <img
                    src="/schemaDark.svg"
                    alt=""
                    className="col-start-1 row-start-1 dark-img"
                /> */}
                
                <div className="relative col-start-1 row-start-1 w-90 rounded-[8px] shadow-lg overflow-hidden">
                    <img
                        src="/SchemaDark.png"
                        alt="Schema"
                        className="w-full h-full object-cover dark-img"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            </div>
            
        </div>
    );
};

export default Schemas;
