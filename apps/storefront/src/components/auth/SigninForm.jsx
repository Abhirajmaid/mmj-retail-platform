"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@jewellery-retail/ui";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import userAction from "@/src/lib/action/user.action";
import { Toast } from "@/src/context/ToastContext";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  mobile_number: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(15, { message: "Mobile number must be less than 15 digits" })
    .regex(/^[0-9]+$/, { message: "Mobile number can only contain digits" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(15, { message: "Password must be no more than 15 characters long" }),
});

const SigninForm = () => {
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const { success, error, warn } = Toast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      mobile_number: "",
      password: "user1234",
    },
  });

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  function onSubmit(values) {
    setLoader(true);
    userAction
      .signIn(values)
      .then((resp) => {
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", JSON.stringify(resp.data.jwt));
        success("You are Successfuly Log In");
        setLoader(false);
        setCookie("jwt", resp.data.jwt, { maxAge: 60 * 60 * 24 });
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
        warn("Server Error");
        error(e?.response?.data?.error?.message);
        setLoader(false);
      });
  }

  return (
    <div>
      <div className="flex min-h-[90vh] bg-white">
        {/* Left Image Section */}
        <div className="w-[55%] min-h-full">
          <Image
            src="/statics/contact_us.jpg"
            alt="Jewellery Model"
            className="object-cover w-full min-h-full"
            width={1500}
            height={1500}
          />
        </div>

        {/* Right Form Section */}
        <div className="w-[60%] flex flex-col justify-center px-16 pl-[80px]">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Log In</h2>
          <p className="text-gray-600 mb-12">Log In with OTP verification</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-[75%]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="jhondoe@gmail.com"
                        {...field}
                        className="w-full px-4 !py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number (WhatsApp) *</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="+91 7385302967"
                        {...field}
                        className="w-full px-4 !py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loader ? true : false}
                  className={`w-[30%] bg-primary text-white py-6 rounded-lg transition hover:bg-primary`}
                >
                  Log In
                </Button>
              }
              <p className="text-start text-gray-600">
                Dodn't have an account?{" "}
                <Link href="/sign-up" className="text-primary">
                  Sign Up
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
