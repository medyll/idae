/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event: any) {
  console.log('here session about !!');
  return event.locals.user
         ? {
      user: {
        // only include properties needed client-side —
        // exclude anything else attached to the user
        // like access tokens etc
        name  : event.locals.user.name,
        email : event.locals.user.email,
        avatar: event.locals.user.avatar
      }
    }
         : {};
}

export {};