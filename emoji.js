// Copyright Tsung Wu <tsung.bz@gmail.com>
// twitter: @ioNull
// github: http://github.com/ioNull/emoji.js
// 
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

if (!console || ! console.log) {
	console = {
		log: function() {}
	};
}
var ioNull = {
	emoji: function() {
		function Emoji() {
			this.init();
		};
		Emoji.prototype = {
			init: function() {
				console.log('init');
				//init map
				this.map();
			},
			parse: function(what) {
				var unicodes;
				if (what) {
					unicodes = punycode.ucs2.decode(what);
				} else {
					return '';
				}
				console.log(unicodes.length);
				var unicodeString = '';
				var kinds = this.map();
				for (var now = 0; now < unicodes.length;) {
					var unicode = unicodes[now];
					var isEmoji = false;
					var isEmojiUnicode = false;
					if (unicode >= 0xE000 && unicode < 0xE538) {
						unicodeString = unicode.toString(16);
						console.log('it is emoji: ' + unicode + punycode.ucs2.encode([unicode]) + ' : ' + unicodeString);
						//replace with img directly
						isEmoji = true;
					} else if (
							//左上左下右上右下箭头
							(unicode >=0x2196 && unicode <=0x2199) || 
							//左右三角箭头
							(unicode == 0x25C0 || unicode == 0x25B6) ||
							//2三角左右
							(unicode == 0x23EA || unicode == 0x23E9) ||
							(unicode >= 0x2600 && unicode <= 0x3299) || 
							(unicode >= 0x1f000 && unicode <= 0x1f700)) {
						unicodeString = unicode.toString(16);
						console.log('it is unicode 6 emoji: ' + unicode + punycode.ucs2.encode([unicode]) + ' : ' + unicodeString);
						//we need to find out what is mapped
						isEmoji = true;
						isEmojiUnicode = true;
					} else {
						//console.log('it is not emoji' + unicode);
					}

					if (isEmoji) {
						for (var i = 0; i < kinds.length; ++i) {
							var kind = kinds[i];
							for (var j = 0; j < kind.length; ++j) {
								var emo = kind[j];
								var found = false;
								if (isEmojiUnicode && emo[1] == unicodeString) {
									found = true;
								} else if (!isEmojiUnicode && emo[0] == unicodeString) {
									found = true;
								}

								if (found) {
									console.log('emojis string is: ' + emo[0]);
									var data = 'data:image/png;base64,' + emo[2];
									var html = '<img style="display: inline;vertical-align: middle;" src="' + data + '"/>';
									console.log('img is: ' + html);
									//remove old text, add html string
									var puny = punycode.ucs2.decode(html);
									console.log('puny length: ' + puny.length);
									unicodes.splice(now, 1);
									for (var curr = 0; curr < puny.length; ++curr) {
										unicodes.splice(now, 0, puny[curr]);
										//move next
										++now;
									}
									//index increase next loop
									--now;
									console.log('unicodes length: ' + unicodes.length);
								}
							}
						}
					}
					++now;
				}
				console.log('unicodes length: ' + unicodes.length);
				var html = punycode.ucs2.encode(unicodes);
				return html;
			},
			map: function() {
				if (!Emoji.list) {
					Emoji.list = getEmojiList();
				}
				return Emoji.list;
			}
		};
		return new Emoji();
	}
}

ioNull.emoji = ioNull.emoji();
