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
  FormMessage,
} from "@jewellery-retail/ui";
import userAction from "@/src/lib/action/user.action";

const formSchema = z.object({
  mobile_number: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(15, { message: "Mobile number must be less than 15 digits" })
    .regex(/^[0-9]+$/, { message: "Mobile number can only contain digits" }),
});

const CTA = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile_number: "",
    },
  });

  const handleSubscribe = (values) => {
    console.log(values);
    userAction
      .postSubscriber(values)
      .then()
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <section className="relative md:w-[1300px] w-[90%] mx-auto bg-primary md:p-14 p-8 flex justify-between rounded-lg md:mt-[200px] mt-[80px] md:mb-[70px] mb-[140px]">
      <div className="flex flex-col gap-6 md:w-1/2 w-full">
        <h1 className="text-[30px] font-bold text-white">
          Share Your Contact:
        </h1>
        <div className="w-full flex">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubscribe)}
              className="space-y-6 w-full"
            >
              <div className="flex w-full">
                <div className="px-4 py-[10px] bg-[#D9D9D9] font-semibold text-[18px] rounded-l-md">
                  +91
                </div>
                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type="text"
                          placeholder="+91 7385302967"
                          {...field}
                          className="input !bg-white w-full rounded-r-md text-[18px] !border-none input-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="bg-sec md:w-[25%] w-full"
                type="submit"
                variant="sec"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <p className="hidden md:block text-[14px] text-white">
          Share your WhatsApp number, <br />
          it will be used to share you new jewellery designs each week!
        </p>
        <p className="md:hidden block text-[14px] text-white">
          Share your WhatsApp number, it will be used to share you new jewellery
          designs each week!
        </p>
      </div>
      <Image
        src="/statics/cta.svg"
        width={700}
        height={700}
        alt="MMJ"
        className="absolute right-0 -top-[142px] w-auto h-[500px] hidden md:block "
      />
    </section>
  );
};

export default CTA;
