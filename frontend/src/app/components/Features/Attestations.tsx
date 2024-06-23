import UpRightArrowIcon from "@/app/svg/UpRightArrowIcon";

const Attestations = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse md:items-center gap-8 feature">
      <div className="px-2 md:px-8">
        <h2 className="flex font-serif items-center gap-2 text-2xl font-semibold">
          <span>Attestations </span>
          <span>
            <UpRightArrowIcon />
          </span>
        </h2>
        <p className="text-lg font-serif opacity-75">
          Attestations serve as a bridge between the digital and physical
          worlds, providing a mechanism to verify and validate claims in various
          scenarios.
        </p>
      </div>
      <div className="grid grid-cols-1 grid-rows-1 feat-img-left" aria-hidden>
        {/* <img
          src="/starknetlogo.svg"
          alt=""
          className="col-start-1 row-start-1 dark-img"
        /> */}
        <div className="relative col-start-1 row-start-1 w-90 rounded-[8px] shadow-lg overflow-hidden">
          <img
            src="/attestationsDark.png"
            alt="Schema"
            className="w-full h-full object-cover dark-img"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>
      
    </div>
  );
};

export default Attestations;
