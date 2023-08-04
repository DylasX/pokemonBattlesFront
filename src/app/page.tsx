'use client';
import Image from 'next/image';
import React from 'react';
import { io } from 'socket.io-client';

const NEXT_PUBLIC_SOCKET_SERVER_URL = 'localhost:4000';

export default function Home() {
  const [myPokemon, setMyPokemon] = React.useState<any>({
    name: '',
    stats: [{}],
  });
  const [rival, setRival] = React.useState<any>({ name: '', stats: [{}] });
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    console.log('Connecting to WebSocket server...');
    const newSocket = io(NEXT_PUBLIC_SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      joinToRoom(newSocket);
    });

    newSocket.on('message', (newMessage) => {
      console.log('Received message:', newMessage);
    });

    newSocket.on('joinedRoom', (data) => {
      setMyPokemon({
        ...data.user.pokemon,
        currentHp: data.user.pokemon?.stats[0].base_stat,
      });
    });

    newSocket.on('newOpponent', (data) => {
      setRival({
        ...data.user.pokemon,
        currentHp: data.user.pokemon?.stats[0].base_stat,
      });
      newSocket.emit('previousPokemon');
    });

    newSocket.on('previousOpponent', (data) => {
      setRival({
        ...data.user.pokemon,
        currentHp: data.user.pokemon?.stats[0].base_stat,
      });
    });

    newSocket.on('leftRoom', () => {
      setRival({ name: '', stats: [{}] });
      setMyPokemon({ name: '', stats: [{}] });
    });

    // Clean up the socket connection on unmount
    return () => {
      console.log('Disconnecting from WebSocket server...');
      newSocket.disconnect();
    };
  }, []);

  const joinToRoom = (socket: any) => {
    socket.emit('joinRoom', {
      room: 'general',
      pokemon: { id: Math.ceil(Math.random() * 150 + 1) },
    });
  };

  return (
    <main className='min-h-screen p-5 h-screen'>
      <section className='playerOne flex w-full flex-col justify-evenly h-2/5'>
        <div className='Pokemonui w-full max-w-md'>
          <div className='flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100'>
            <Image
              className='rounded-t-lg color-white w-16 ml-1 h-16 grayscale opacity-10 rotate-12'
              src='pokeball.svg'
              alt='pokemon1'
              width={120}
              height={120}
            />
            <div className='flex flex-col justify-between p-4 leading-normal w-full'>
              <div className='inline-flex items-center justify-between'>
                <h5 className='text-xl capitalize font-bold tracking-tight text-zinc-900'>
                  {rival.name.toLowerCase()}
                </h5>
                {/* <h5 className='text-sm font-bold tracking-tight'>LVL 100</h5> */}
              </div>
              <div className='mb-3 font-normal text-zinc-700 inline-flex items-center'>
                <span className='mr-1 text-zinc-700 font-bold'>HP:</span>
                <div className='w-full bg-gray-200 rounded-full h-2.5 '>
                  <div
                    style={{
                      width: `${(
                        (rival.currentHp * 100) /
                        rival?.stats[0]?.base_stat
                      ).toFixed(0)}%`,
                    }}
                    className={`bg-green-600 h-2.5 rounded-full`}
                  ></div>
                </div>
              </div>
              <span className='ml-auto -mt-3'>
                {rival?.currentHp}/{rival?.stats[0]?.base_stat}
              </span>
            </div>
          </div>
        </div>
        <div className='pokemon relative'>
          <Image
            src={`https://img.pokemondb.net/sprites/black-white/normal/${rival.name.toLowerCase()}.png`}
            width={150}
            height={150}
            alt='pokemon'
            className='ml-auto'
          ></Image>
          <Image
            src={'/shadow.png'}
            width={200}
            height={200}
            alt='pokemon'
            className='ml-auto absolute top-28 -right-6'
          ></Image>
        </div>
      </section>
      <section className='playerTwo -mt-8 flex w-full flex-col justify-evenly'>
        <div className='pokemon relative'>
          <Image
            src={`https://img.pokemondb.net/sprites/black-white/back-normal/${myPokemon.name.toLowerCase()}.png`}
            width={170}
            height={170}
            alt='pokemon'
            className='mr-auto'
          ></Image>
          <Image
            src={'/shadow.png'}
            width={200}
            height={200}
            alt='pokemon'
            className='ml-auto absolute top-28 -left-3'
          ></Image>
        </div>
        <div className='Pokemonui w-full max-w-md z-0'>
          <div className='flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100'>
            <Image
              className='rounded-t-lg color-white w-16 ml-1 h-16 grayscale opacity-10 rotate-12'
              src='pokeball.svg'
              alt='pokemon1'
              width={120}
              height={120}
            />
            <div className='flex flex-col justify-between p-4 leading-normal w-full'>
              <div className='inline-flex items-center justify-between'>
                <h5 className='text-xl capitalize font-bold tracking-tight text-zinc-900'>
                  {myPokemon.name}
                </h5>
                {/* <h5 className='text-sm font-bold tracking-tight'>LVL 100</h5> */}
              </div>
              <div className='mb-3 font-normal text-zinc-700 inline-flex items-center'>
                <span className='mr-1 text-zinc-700 font-bold'>HP:</span>
                <div className='w-full bg-gray-200 rounded-full h-2.5 '>
                  <div
                    style={{
                      width: `${(
                        (myPokemon.currentHp * 100) /
                        myPokemon?.stats[0]?.base_stat
                      ).toFixed(0)}%`,
                    }}
                    className='bg-green-600 h-2.5 rounded-full'
                  ></div>
                </div>
              </div>
              <span className='ml-auto -mt-3'>
                {myPokemon.currentHp}/{myPokemon.stats[0]?.base_stat}
              </span>
            </div>
          </div>
        </div>
        <div className='abilities flex flex-row flex-wrap h-36 mt-2 gap-6'>
          {myPokemon?.moves?.map((move: any, index: number) => (
            <a
              className='w-[45%] h-2/4 bg-white border rounded-md border-gray-200 flex justify-center items-center content-center'
              href='#'
              onClick={() => console.log('clickMe')}
              key='index'
            >
              <Image
                className='rounded-t-lg color-white w-16 ml-1 h-16 grayscale opacity-10 rotate-12 absolute'
                src='pokeball.svg'
                alt='pokemon1'
                width={120}
                height={120}
              />
              <h3 className='font-bold text-xl uppercase'>{move.name}</h3>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
