"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@jewellery-retail/ui";
import metalRateAction from "@/src/lib/action/metalRate.action";
import { SectionTitle } from "@/src/components";
import { Toast } from "@/src/context/ToastContext";
import { Icon } from "@iconify/react";

const formSchema = z.object({
  gold24k: z.coerce.number().min(2),
  gold22k: z.coerce.number().min(2),
  gold18k: z.coerce.number().min(2),
  gold12k: z.coerce.number().min(2),
  silver: z.coerce.number().min(2),
});

const page = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const { success, error } = Toast();

  useEffect(() => {
    getRateList();
  }, []);

  const getRateList = () => {
    metalRateAction.getMetalRates().then((resp) => {
      setData(resp.data.data);
      console.log(resp.data.data);
    });
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gold24k: "",
      gold22k: "",
      gold18k: "",
      gold12k: "",
      silver: "",
    },
  });

  const getRateByName = (name) =>
    data?.find((item) => item?.attributes?.name === name)?.attributes?.rate;

  function onSubmit(values) {
    setLoading(true);
    if (values) {
      metalRateAction.updateMetalRate(1, values?.gold24k).catch((e) => {
        console.log("error", e);
        error("Something Went Wrong!");
      });
      metalRateAction.updateMetalRate(2, values?.gold22k).catch((e) => {
        console.log("error", e);
        error("Something Went Wrong!");
      });
      metalRateAction.updateMetalRate(3, values?.gold18k).catch((e) => {
        console.log("error", e);
        error("Something Went Wrong!");
      });
      metalRateAction.updateMetalRate(4, values?.gold12k).catch((e) => {
        console.log("error", e);
        error("Something Went Wrong!");
      });
      metalRateAction.updateMetalRate(5, values?.silver).catch((e) => {
        console.log("error", e);
        error("Something Went Wrong!");
      });
      success("Rates Updated Successfuly!");
      setLoading(false);
    } else {
      error("Value are not updated");
    }
  }

  return (
    <>
      <div>
        <SectionTitle title="Update Metal Rates." txtColor="black" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10 pt-14"
        >
          <FormField
            control={form.control}
            name="gold24k"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gold 24KT</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={getRateByName("Gold 24KT")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Type current 24KT metal rate. (Per Gram)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gold22k"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gold 22KT</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={getRateByName("Gold 22KT")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Type current 22KT metal rate. (Per Gram)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gold18k"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gold 18KT</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={getRateByName("Gold 18KT")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Type current 18KT metal rate. (Per Gram)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gold12k"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gold 12KT</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={getRateByName("Gold 12KT")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Type current 12KT metal rate. (Per Gram)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="silver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Silver</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={getRateByName("Silver")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Type current silver rate. (Per Gram)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary hover:bg-bg_dark hover:text-black text-white"
            variant="primary"
          >
            {loading ? (
              <Icon icon="svg-spinners:180-ring" width={20} />
            ) : (
              <>Submit</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default page;
