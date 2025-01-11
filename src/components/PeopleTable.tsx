import React, { FC } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  motherName?: string;
  fatherName?: string;
}

interface Props {
  people: Person[];
}

// Функція генерує slug: name (у нижньому регістрі, з пробілами на "-") + "-" + рік народження
function getSlug(person: Person): string {
  return person.name.toLowerCase().replace(/\s+/g, '-') + '-' + person.born;
}

export const PeopleTable: FC<Props> = ({ people }) => {
  // Дістаємо :slug (якщо його немає, буде undefined)
  const { slug } = useParams();

  return (
    <div className="block">
      <div className="box table-container">
        <table
          data-cy="peopleTable"
          className="table is-striped is-hoverable is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Born</th>
              <th>Died</th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>

          <tbody>
            {people.map(person => {
              const personSlug = getSlug(person);

              // Перевіряємо, чи збігається поточний :slug з slug цієї персони
              const isSelected = slug === personSlug;

              // Логіка для матері
              let motherCell: React.ReactNode = '-';

              if (person.motherName) {
                // Якщо motherName є (непорожнє), шукаємо відповідну особу
                const mother = people.find(p => p.name === person.motherName);

                if (mother) {
                  // Якщо знайшли
                  const motherSlug = getSlug(mother);

                  motherCell = (
                    <Link
                      to={`/people/${motherSlug}`}
                      className={mother.sex === 'f' ? 'has-text-danger' : ''}
                    >
                      {mother.name}
                    </Link>
                  );
                } else {
                  // Якщо не знайшли — текст
                  motherCell = person.motherName;
                }
              }

              // Логіка для батька
              let fatherCell: React.ReactNode = '-';

              if (person.fatherName) {
                // Якщо fatherName є (непорожнє)
                const father = people.find(p => p.name === person.fatherName);

                if (father) {
                  const fatherSlug = getSlug(father);

                  fatherCell = (
                    <Link
                      to={`/people/${fatherSlug}`}
                      className={father.sex === 'f' ? 'has-text-danger' : ''}
                    >
                      {father.name}
                    </Link>
                  );
                } else {
                  fatherCell = person.fatherName;
                }
              }

              // Ім’я самої людини
              const nameLink = (
                <Link
                  to={`/people/${personSlug}`}
                  // Якщо це жінка, додаємо .has-text-danger
                  className={person.sex === 'f' ? 'has-text-danger' : ''}
                >
                  {person.name}
                </Link>
              );

              return (
                <tr
                  key={personSlug}
                  data-cy="person"
                  className={isSelected ? 'has-background-warning' : ''}
                >
                  <td>{nameLink}</td>
                  <td>{person.sex}</td>
                  <td>{person.born}</td>
                  <td>{person.died}</td>
                  <td>{motherCell}</td>
                  <td>{fatherCell}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
