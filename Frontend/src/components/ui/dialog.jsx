import React, { useState } from "react";

export function Dialog({ children }) {
  return <div>{children}</div>;
}

export function DialogTrigger({ children }) {
  return <>{children}</>;
}

export function DialogContent({ children, className }) {
  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center ${className}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">{children}</div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-700 mb-4">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end">{children}</div>;
}
