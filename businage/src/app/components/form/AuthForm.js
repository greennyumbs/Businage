"use client";
import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "@/app/assets/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/assets/EyeFilledIcon";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/dist/server/api-utils";

const AuthForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(e) {
    e.preventDefault();

    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "",
      options: {
        redirectTo: `/`,
      },
    });

    if (error) {
      console.log(error);
    } else {
      return redirect(data.url);
    }
  }

  function handleForgetPassword() {
    console.log("Fuck you");
  }

  return (
    <div className="box w-1/2 h-1/2 flex flex-col justify-center items-center">
      <p className="pb-4 font-bold text-2xl">Log In</p>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Input
          isClearable
          isRequired
          type="email"
          label="Email"
          placeholder="Enter your email"
          onClear={() => console.log("input cleared")}
          className="max-w-xs mb-3"
        />
        <Input
          isRequired
          label="Password"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        <p
          className="text-xs mt-1 text-blue-400 text-right hover:cursor-pointer"
          onClick={handleForgetPassword}
        >
          Forgot Password?
        </p>
        <Button type="submit" className="w-full mt-5">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
