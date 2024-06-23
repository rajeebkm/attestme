import Header from "../components/Header";
import Footer from "../components/Footer";
import SchemasTable from "../components/SchemasTable/SchemasTable";

export default async function Page() {
  return (
    <div className="">
      <Header/>
      <SchemasTable />
      <Footer/>
    </div> 
  );
}