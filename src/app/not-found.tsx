import Container from "@/components/Container";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

const NotFoundPage = () => {
  return (
    <div className="pt-8">
      <Container>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Requested Page Not Found</h2>
          <div>
            <Link
              href="/"
              className="text-slate-500 flex items-center gap-1 mt-2"
            >
              <MdArrowBack />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
