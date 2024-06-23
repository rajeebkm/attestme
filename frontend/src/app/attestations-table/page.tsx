import Header from "../components/Header";
import Footer from "../components/Footer";
import AttestationsTable from "../components/AttestationsTable/AttestationsTable";

export default async function Page() {
  return (
    <div className=" ">
      <Header/>
      <AttestationsTable />
      <Footer/>
    </div>
  );
}