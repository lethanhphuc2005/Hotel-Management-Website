import { WebsiteContent } from "@/types/websiteContent";

export function New1({ new1 }: { new1: WebsiteContent }) {
  if (!new1) return null;
  return (
    <>
      <div className="row">
        <h3 className="text-center mt-5 mb-5" style={{ letterSpacing: "5px" }}>
          {new1.title}
        </h3>
        <div className="col">
          <p style={{ color: "#FAB320" }}>
            {new1.content_type[0]?.name} -{" "}
            {new1?.updatedAt?.toLocaleDateString("vi-VN")}
          </p>
          {/* - {new1.NgayDang.toLocaleDateString('vi-VN')} */}
          <p className="lh-lg fs-6" style={{ textAlign: "justify" }}>
            {new1.content}
          </p>
        </div>
        <div className="col">
          <img
            className="w-100"
            style={{ height: "350px", objectFit: "cover" }}
            src={`/img/${new1.image}`}
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export function New2({ new2 }: { new2: WebsiteContent }) {
  if (!new2) return null;
  return (
    <>
      <div className="row">
        <h3 className="mt-4 mb-4" style={{ letterSpacing: "5px" }}>
          {new2.title}
        </h3>
        <p style={{ color: "#FAB320" }}>
          {new2.content_type[0]?.name} -{" "}
          {new2?.updatedAt?.toLocaleDateString("vi-VN")}
        </p>
        <div className="col">
          <img className="w-100" src={`/img/${new2.image}`} alt="" />
        </div>
        <div className="col">
          <p style={{ textAlign: "justify", lineHeight: "30px" }}>
            {new2.content}
          </p>
        </div>
      </div>
    </>
  );
}

export function New3({ new3 }: { new3: WebsiteContent }) {
  if (!new3) return null;
  return (
    <>
      <div className="row">
        <h3 className="mt-4 mb-4" style={{ letterSpacing: "5px" }}>
          {new3.title}
        </h3>
        <p style={{ color: "#FAB320" }}>
          {new3.content_type[0]?.name} -{" "}
          {new3?.updatedAt?.toLocaleDateString("vi-VN")}
        </p>
        <div className="col">
          <p style={{ textAlign: "justify", lineHeight: "30px" }}>
            {new3.content}
          </p>
        </div>
        <div className="col">
          <img className="w-100" src={`/img/${new3.image}`} alt="" />
        </div>
      </div>
    </>
  );
}

export function New4({ new4 }: { new4: WebsiteContent }) {
  if (!new4) return null;
  return (
    <>
      <img
        className="mt-4 w-100"
        style={{ height: "380px", objectFit: "cover" }}
        src={`/img/${new4.image}`}
        alt=""
      />
      <h3 className="mt-4 mb-4" style={{ letterSpacing: "5px" }}>
        {new4.title}
      </h3>
      <p style={{ color: "#FAB320" }}>
        {new4.content_type[0]?.name} -{" "}
        {new4?.updatedAt?.toLocaleDateString("vi-VN")}
      </p>
      <p style={{ textAlign: "justify", lineHeight: "30px" }}>{new4.content}</p>
    </>
  );
}
