import tensorflow as tf
hello = tf.constant('Hello,world!')
sess = tf.Session()
result = sess.run(hello)
sess.close()
print(result)