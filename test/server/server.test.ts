import dotenv from "dotenv";
dotenv.config();

import app from "../../server/server";
import request from "supertest";
import mockSession from "mock-session";

describe("Main app", () => {
  test("should return 200 when logged in", async () => {
    const cookie = mockSession("session", process.env.SECRET, { user: { id: "tester" } });
    await request(app)
      .get("/")
      .set("Cookie", [cookie])
      .expect(200);
  });

  test("should redirect to /login when not logged in", async () => {
    const cookie = mockSession("session", process.env.SECRET, {});
    await request(app)
      .get("/")
      .set("Cookie", [cookie])
      .expect(302);
  });
});
