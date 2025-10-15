import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-5xl font-bold text-center">
        {" "}
        Welcome to EkklesiaHub!
      </h1>
      <p className="text-2xl text-center max-w-2xl text-gray-700 dark:text-gray-100 ">
        This is a modern web application built with Next.js, TypeScript, and
        Tailwind CSS. It features a responsive design, dark mode support, and
        seamless navigation.
      </p>
      <Image
        src="/AuDev_logo.png"
        alt="Audev Logo"
        width={200}
        height={40}
        priority
      />
    </div>
  );
}
