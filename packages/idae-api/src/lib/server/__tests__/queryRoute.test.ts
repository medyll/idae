import { beforeAll, afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { idaeApi } from "$lib/server/IdaeApi.js";

const authConfig = {
  port: 0,
  enableAuth: true,
  jwtSecret: "supersecretkeysupersecretkey",
  tokenExpiration: "1h",
  useMemoryDb: true,
};

let token: string;

describe("/query route hardening", () => {
  beforeAll(async () => {
    idaeApi.setOptions(authConfig);
    await idaeApi.start();

    const loginResponse = await request(idaeApi.app)
      .post("/login")
      .send({ username: "admin", password: "password" })
      .expect(200);
    expect(loginResponse.body.token).toBeTruthy();
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await idaeApi.stop();
  });

  it("rejects unauthenticated calls", async () => {
    await request(idaeApi.app)
      .post("/query/testCollection/find/params")
      .send({})
      .expect(401);
  });

  it("rejects non-whitelisted commands", async () => {
    await request(idaeApi.app)
      .post("/query/testCollection/dropDatabase/params")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe("Query command not allowed");
      });
  });

  it("executes allowed command with auth", async () => {
    await request(idaeApi.app)
      .post("/query/testCollection/find/params")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });
});
