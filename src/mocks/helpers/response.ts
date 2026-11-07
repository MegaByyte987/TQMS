import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: PaginationMeta): NextResponse {
  return NextResponse.json({ data, meta });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ data: null, message }, { status: 400 });
}

export function notFound(message = "Record not found."): NextResponse {
  return NextResponse.json({ data: null, message }, { status: 404 });
}

export function conflict(message: string): NextResponse {
  return NextResponse.json({ data: null, message }, { status: 409 });
}

export function fieldErrors(errors: Record<string, string[]>): NextResponse {
  return NextResponse.json({ data: null, errors }, { status: 422 });
}