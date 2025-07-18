import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/Checkout-steps";


export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippngAddressPage = async () => {
    const cart = await getMyCart()
    if(!cart || cart.items.length === 0) redirect('/cart')
    
        const session = await auth();

        const userId = session?.user?.id;

        if(!userId) throw new Error('No User ID')
        
        const user = await getUserById(userId);

    return ( <>
        <CheckoutSteps current={1} />
        <ShippingAddressForm address={user.address as ShippingAddress} />
    </> );
}
 
export default ShippngAddressPage;