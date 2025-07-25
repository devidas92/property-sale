import Link from "next/link";
import clsx from "clsx";
const InfoBox = ({ heading,textColor ='text-gray-800',backgroundColor='bg-gray-100', buttonInfo, children }) => {
  return (
    <div className={clsx(backgroundColor,"p-6 rounded-lg shadow-md")} >
      <h2 className="text-2xl font-bold">{heading}</h2>
      <p className={clsx(textColor,"mt-2 mb-4")}>{children} </p>
      <Link
        href={buttonInfo.href}
        className={clsx(buttonInfo.backgroundColor,buttonInfo.hover,buttonInfo.textColor ,'inline-block rounded-lg px-4 py-2')}
      >
        {buttonInfo.text}
      </Link>
    </div>
  );
};

export default InfoBox;
