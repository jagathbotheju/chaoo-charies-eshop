import Container from "@/components/Container";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

const NotAuthorizedPage = () => {
  return (
    <div className="pt-8">
      <Container>
        <div className="flex flex-col items-center bg-red-50 p-10 rounded-lg">
          <h2 className="text-2xl text-bold text-red-600">ADMIN AREA</h2>
          <h2 className="text-2xl text-bold text-red-600">
            You Are Not Authorized
          </h2>
          <div>
            <Link
              href="/"
              className="text-slate-500 flex items-center gap-1 mt-2"
            >
              <MdArrowBack />
              <span>HOME</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotAuthorizedPage;
