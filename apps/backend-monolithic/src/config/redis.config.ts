import { ConnectionOptions } from "bullmq";
import * as dotenv from "dotenv";
import { RedisClientOptions } from "redis";

//
//  Defaults
//

const DEFAULT_REDIS_HOST = "localhost";
const DEFAULT_REDIS_PORT = 6379;
const DEFAULT_REDIS_PASSWORD = "tM7lUI/gmtg/a67VjrtikA==";

//
//  Values
//

dotenv.config();

/** The host for the Redis connection. */
export const REDIS_HOST: string = process.env.REDIS_HOST || DEFAULT_REDIS_HOST;

/** The exposed port for the Redis connection. */
export const REDIS_PORT: number =
  (process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : null) || DEFAULT_REDIS_PORT;

/** The password for the Redis conneciton. */
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || DEFAULT_REDIS_PASSWORD;

//
//  Functions
//

export function getIoRedisConnectionOptions(): ConnectionOptions {
  return {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  };
}

export function getRedisConnectionOptions(): RedisClientOptions {
  return {
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  };
}
