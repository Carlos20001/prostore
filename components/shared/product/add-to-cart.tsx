"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { toast } from "sonner"; // <-- Changed this import
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
       const res = await addItemToCart(item);
    if (!res.success) {
      toast.error(res.message); // Changed to use toast.error (dot notation)
      return;
    }
    toast.success(res.message, { // Changed to use toast.success (dot notation)
      action: {
        label: "Go to Cart",
        onClick: () => router.push("/cart"),
      },
    });
  })   
};

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res && res.success) {
        toast.success(res.message);
      }
      return;
    });
  }

  // Check if item is in cart
  const existItem = cart?.items?.find((cartItem) => cartItem.productId === item.productId);
  return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        {isPending ? (<Loader className="h-4 w-4 animate-spin" />) : (<Minus className="h-4 w-4" />)}
      </Button>
      <span className="px-2">{existItem.qty}</span>
       <Button type='button' variant='outline' onClick={handleAddToCart}>
         {isPending ? (<Loader className="h-4 w-4 animate-spin" />) : (<Plus className="h-4 w-4" />)}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (<Loader className="h-4 w-4 animate-spin" />) : (<Plus className="h-4 w-4" />)}
      Go To Cart
    </Button>
  );
}
 
export default AddToCart;
