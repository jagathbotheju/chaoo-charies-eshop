"use client";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import queryString from "query-string";
import { useRouter } from "next/navigation";

const SearchSchema = z.object({
  searchTerm: z.string().min(1, {
    message: "Please enter something to search",
  }),
});

const SearchBar = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof SearchSchema>) => {
    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: {
          searchTerm: formData.searchTerm,
        },
      },
      { skipNull: true }
    );
    router.push(url);
    form.reset();
  };

  return (
    <div className="flex items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="text"
                    placeholder="Search anything..."
                    className="p-2 border border-gray-300 rounded-l-md rounded-r-none focus:outline-none focus:border-[0.5px] focus:border-slate-500 w-80"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="bg-slate-700 hover:opacity-80 text-white p-2 rounded-r-md rounded-l-none w-fit">
            Search
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchBar;
