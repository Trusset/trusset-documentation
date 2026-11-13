export const ContactEmail = ({ user = 'hello', domain = 'trusset.de' }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <span className="trusset-contact-email">
        {user}
        <span>@</span>
        {domain}
      </span>
    );
  }

  const address = [user, domain].join(String.fromCharCode(64));
  return (
    <a className="link trusset-contact-email" href={['mailto', address].join(':')}>
      {address}
    </a>
  );
};
