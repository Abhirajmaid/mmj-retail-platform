import Image from "next/image";
import Link from "next/link";

const Story = ({ name, image }) => {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="/"
        className="w-20 h-20 md:w-28 md:h-28 bg-sec rounded-full p-[2px]"
      >
        <div className="w-full h-full bg-white rounded-full p-[2px] overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={156}
            height={156}
            className="rounded-full aspect-square w-full h-full"
          />
        </div>
      </Link>
      <p className="text-xs mt-2">{name}</p>
    </div>
  );
};

export default Story;
