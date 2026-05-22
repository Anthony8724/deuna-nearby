import { supabase } from "../../src/lib/supabase";

export default async function Businesses(){

const {data,error}=await supabase
.from("businesses")
.select("*");

if(error)
return <div>{error.message}</div>;

return(

<div>

<h1>Negocios registrados</h1>

{
data?.map((b)=>(

<div key={b.id}>

<h2>{b.name}</h2>

<p>{b.category}</p>

</div>

))
}

</div>

);

}