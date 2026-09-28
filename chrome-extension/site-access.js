// Shared by setup and the worker so permission prompts match playback checks.
function overlayOrigins(urls) {
  const patterns=new Set();
  for(const value of urls) {
    const u=new URL(value);if(!['http:','https:'].includes(u.protocol))continue;
    const hosts=[u.hostname];
    if(['google.com','www.google.com','youtube.com','www.youtube.com'].includes(u.hostname)) {
      const base=u.hostname.replace(/^www\./,'');hosts.push(base,'www.'+base);
    }
    for(const host of hosts) for(const scheme of (u.protocol==='http:'?['http:','https:']:[u.protocol])) patterns.add(scheme+'//'+host+'/*');
  }
  return [...patterns];
}
