/* Cloudflare Pages: /s/{slug}/ მისამართზე გამოქვეყნებული საიტები (იგივე კოდი, რაც Worker-ში). */
import worker from '../../src/worker.js';

export const onRequest = (context) => worker.fetch(context.request, context.env);
