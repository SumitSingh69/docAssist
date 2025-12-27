import Image from "next/image";
import authImage from "@/app/assests/images/auth_image.jpg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left side - Image (60% width on desktop) */}
      <div className="hidden lg:flex lg:w-[60%] relative">
        <Image
          src={authImage}
          alt="Healthcare illustration"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right side - Auth form (40% width on desktop, full on mobile) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-12 relative">
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
