import React from 'react'

export default function Rules() {
  return (
    <div id='rules'>
      
          <h3 id='rulesHeading'>RULES</h3>
          <ul className='rulesList'>
              <li className='rule'>The username does not have to be the users real name.</li>
              <li className='rule'>Username and email must be unique</li>
              <li className='rule'>Passwords must be at least 8 characters.</li>
              <li className='rule'>All admin users must be older than 18</li>
              <li className='rule'>Users may only on initial registration register as an admin user</li>
          </ul>
    </div>
  )
}
