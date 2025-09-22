import type React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  className = "",
  ...props
}) => (
  <img
    src={src || "/placeholder.svg"}
    className={`aspect-square h-full w-full object-cover ${className}`}
    {...props}
  />
);

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 ${className}`}
    {...props}
  >
    {children}
  </div>
);
